import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './UserInfoForm.css';
import { useNavigate, useLocation } from "react-router-dom";

const questions = [
  {
    id: 1,
    label: "Name",
    placeholder: "",
    type: "input",
    name: "name",
  },
  {
    id: 2,
    label: "Where do you come from?",
    placeholder: "",
    type: "input",
    name: "origin",
  },
  {
    id: 3,
    label: "What is your occupation?",
    placeholder: "",
    type: "input",
    name: "occupation",
  },
  {
    id: 4,
    label: "What is your first language",
    placeholder: "",
    type: "input",
    name: "language",
  },
  {
    id: 5,
    label: "Where do you live?",
    placeholder: "",
    type: "input",
    name: "location",
  },
];

const UserInfoForm = ({ nextPage }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle input changes
  const handleInputChange = (e, name) => {
    setFormData({
      ...formData,
      [name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);

    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      // Send to backend
      const response = await fetch('/api/user-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);

      setSubmitStatus('success');

      // Navigate after a short delay to show success message
      setTimeout(() => {
        if (nextPage === "youtube") {
          navigate("/youtube");
        } else if (nextPage === "news") {
          navigate("/news");
        }
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
      setErrorMessage(error.message || 'Failed to submit form. Please check if the server is running.');
    }
  };

  return (
    <div className="center-form-container">
      <div className="card-form">
        <h3 className="mb-4 text-center">User Information</h3>
        <Form onSubmit={handleSubmit}>
          {questions.map((question) => {
            if (question.type === "input") {
              return (
                <Form.Group key={question.id} className="mb-3" controlId={`formBasic${question.id}`}>
                  <Form.Label>{question.label}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={question.placeholder}
                    onChange={(e) => handleInputChange(e, question.name)}
                    value={formData[question.name] || ''}
                    defaultValue={question.defaultValue || ''}
                  />
                </Form.Group>
              );
            } else if (question.type === "textarea") {
              return (
                <Form.Group key={question.id} className="mb-3" controlId={`formBasicTextarea${question.id}`}>
                  <Form.Label>{question.label}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={question.placeholder}
                    onChange={(e) => handleInputChange(e, question.name)}
                    value={formData[question.name] || ''}
                  />
                </Form.Group>
              );
            }
            return null;
          })}

          <Button
            variant="primary"
            type="submit"
            className="mt-3 w-100"
            disabled={submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? 'Submitting...' : 'Submit'}
          </Button>

          {submitStatus === 'success' && (
            <div className="text-success mt-2 text-center">Information submitted successfully! Redirecting...</div>
          )}
          {submitStatus === 'error' && (
            <div className="text-danger mt-2 text-center">
              Error: {errorMessage}
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default UserInfoForm;