import React, { useState, useEffect } from 'react';
import {
  Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Tabs, Tab, Button, Grid
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import responseService from '../../services/responseService';
import formService from '../../services/formService';

// Import and register necessary components for Chart.js (v3+)
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function ResponseTab({ formId }) {
  const [responseData, setResponseData] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [chartData, setChartData] = useState(null);
  const [numericalAnalysis, setNumericalAnalysis] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchResponsesAndQuestions = async () => {
      if (!formId) {
        setErrorMessage('Form ID is not available.');
        return;
      }

      setLoading(true);
      try {
        const formResponse = await formService.getForm(formId);
        if (formResponse && formResponse.fields) {
          setQuestions(formResponse.fields);

          const response = await responseService.getResponses(formId);
          if (response && response.length > 0) {
            setResponseData(response);
            prepareChartData(response, formResponse.fields);
            prepareNumericalAnalysis(response, formResponse.fields);
          } else {
            setErrorMessage("No responses found.");
          }
        } else {
          setErrorMessage("No questions found for this form.");
        }
      } catch (error) {
        setErrorMessage("Error fetching responses. Please try again.");
        console.error("Error fetching responses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResponsesAndQuestions();
  }, [formId]);

  const getResponseForQuestion = (questionId, response) => {
    const selectedResponse = response.response.find(res => res.questionLabel === questions.find(q => q._id === questionId)?.label);

    if (selectedResponse) {
      if (selectedResponse.questionType === 'text') {
        return selectedResponse.answer || 'Not answered';
      } else if (selectedResponse.questionType === 'file') {
        return (
          <a href={selectedResponse.answer || ''} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        );
      } else if (selectedResponse.questionType === 'checkbox') {
        // Checkbox answers will be an array, so map through them and display each
        if (Array.isArray(selectedResponse.answer)) {
          return selectedResponse.answer.map((option, index) => (
            <span key={index}>{option}{index < selectedResponse.answer.length - 1 ? ', ' : ''}</span>
          ));
        }
      } else if (['radio', 'multiple choice'].includes(selectedResponse.questionType)) {
        return selectedResponse.answer || 'Not answered';
      }
    }
    return 'Not answered';
  };

  // Prepare chart data with grouped bars for each question and answers
  const prepareChartData = (responses, questions) => {
    const answerCountsPerQuestion = {};

    // Initialize answer counts for each question
    questions.forEach(question => {
      answerCountsPerQuestion[question.label] = {};
      if (question.options && question.options.length > 0) {
        question.options.forEach(option => {
          answerCountsPerQuestion[question.label][option.label] = 0;
        });
      }
    });

    // Calculate answer counts per question
    responses.forEach(response => {
      response.response.forEach(res => {
        const questionLabel = res.questionLabel;
        if (answerCountsPerQuestion[questionLabel]) {
          if (Array.isArray(res.answer)) {
            res.answer.forEach(answer => {
              answerCountsPerQuestion[questionLabel][answer] = (answerCountsPerQuestion[questionLabel][answer] || 0) + 1;
            });
          } else if (typeof res.answer === 'string') {
            answerCountsPerQuestion[questionLabel][res.answer] = (answerCountsPerQuestion[questionLabel][res.answer] || 0) + 1;
          }
        }
      });
    });

    // Prepare data for bar chart
    const labels = Object.keys(answerCountsPerQuestion);
    const datasets = [];
    const colors = ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(153, 102, 255, 0.6)'];

    questions.forEach((question, questionIndex) => {
      const answers = Object.keys(answerCountsPerQuestion[question.label]);
      answers.forEach((answer, answerIndex) => {
        const counts = labels.map(label => answerCountsPerQuestion[label][answer] || 0);
        datasets.push({
          label: `${question.label} - ${answer}`,
          data: counts,
          backgroundColor: colors[answerIndex % colors.length],
        });
      });
    });

    const chartData = {
      labels,
      datasets,
    };

    setChartData(chartData);
  };

  const prepareNumericalAnalysis = (responses, questions) => {
    const analysis = questions.map((question) => {
      const answerCounts = {};

      if (question.options && question.options.length > 0) {
        question.options.forEach(option => {
          answerCounts[option.label] = 0;
        });
      }

      responses.forEach(response => {
        response.response.forEach(res => {
          if (res.questionLabel === question.label) {
            if (Array.isArray(res.answer)) {
              res.answer.forEach(answer => {
                answerCounts[answer] = (answerCounts[answer] || 0) + 1;
              });
            } else if (res.answer && typeof res.answer === 'string') {
              answerCounts[res.answer] = (answerCounts[res.answer] || 0) + 1;
            }
          }
        });
      });

      const totalResponses = responses.length;
      const percentages = Object.keys(answerCounts).map(key => ({
        option: key,
        count: answerCounts[key],
        percentage: totalResponses === 0 ? 0 : ((answerCounts[key] / totalResponses) * 100).toFixed(2),
      }));

      const pieData = {
        labels: Object.keys(answerCounts),
        datasets: [{
          data: Object.values(answerCounts),
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        }]
      };

      return {
        questionLabel: question.label,
        percentages,
        pieData,
      };
    });

    setNumericalAnalysis(analysis);
  };

  const renderChart = () => {
    if (!chartData) return null;

    const chartOptions = { responsive: true };

    if (chartType === 'bar') {
      return <Bar data={chartData} options={chartOptions} />;
    } else if (chartType === 'pie') {
      return <Pie data={chartData} options={chartOptions} />;
    }

    return null;
  };

  return (
    <div>
      <Tabs value={tabValue} onChange={handleTabChange} aria-label="response tabs">
        <Tab label="Responses Table" />
        <Tab label="Response Analysis" />
      </Tabs>

      {loading && <CircularProgress />}

      {!loading && errorMessage && (
        <Typography color="error" variant="body1" gutterBottom>
          {errorMessage}
        </Typography>
      )}

      {!loading && !errorMessage && (
        <>
          {tabValue === 0 && (
            <TableContainer component={Paper}>
              <Table aria-label="responses table">
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    {questions.map((question) => (
                      <TableCell key={question._id} align="right">{question.label}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {responseData.map((response, index) => (
                    <TableRow key={index}>
                      <TableCell>{response.userId || "Anonymous"}</TableCell>
                      {questions.map((question) => (
                        <TableCell key={question._id} align="right">
                          {getResponseForQuestion(question._id, response)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 1 && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <Button variant="contained" onClick={() => setChartType('bar')}>Bar Chart</Button>
                <Button variant="contained" onClick={() => setChartType('pie')} style={{ marginLeft: '10px' }}>Pie Chart</Button>
              </div>

              {renderChart()}

              <div style={{ marginTop: '20px' }}>
                <Typography variant="h6" gutterBottom>Numerical Analysis</Typography>
                {numericalAnalysis.map((analysis, index) => (
                  <div key={index}>
                    <Typography variant="subtitle1">{analysis.questionLabel}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <ul>
                          {analysis.percentages.map((item, idx) => (
                            <li key={idx}>
                              {item.option}: {item.count} responses ({item.percentage}%)
                            </li>
                          ))}
                        </ul>
                      </Grid>
                      <Grid item xs={6}>
                        <Pie data={analysis.pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                      </Grid>
                    </Grid>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!loading && !errorMessage && responseData.length === 0 && (
        <Typography variant="body1" align="center">
          No responses available for this form.
        </Typography>
      )}
    </div>
  );
}

export default ResponseTab;
