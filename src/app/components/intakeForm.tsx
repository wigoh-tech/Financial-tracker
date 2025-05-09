import { useEffect, useState } from 'react';
import FileUpload from './uploadFile';

export default function IntakeForm() {
  const [questions, setQuestions] = useState<{
    options: string | boolean;
    fieldType: string; id: number; question: string
  }[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  useEffect(() => {
    fetch('/api/intake-questions')
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  const handleSubmit = async () => {
    const clientId = "123WER"; // Replace this with your actual logic to get the client ID

    const submission = {
      clientId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId: parseInt(questionId, 10),
        answer: typeof answer === 'string' ? answer.trim() : answer,
      })),
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission),
      });

      if (response.ok) {
        alert('Submission successful!');
        setAnswers({});
      } else {
        const data = await response.json();
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Network error: ${errorMessage}`);
    }
    
  };



  return (
    <div>
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Intake Form</h2>

        {/* 2-column grid for questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <label className="block text-gray-700 font-medium">{q.question}</label>

              {q.fieldType === 'textarea' ? (
                <textarea
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              ) : q.fieldType === 'radio' && q.options ? (
                <div className="space-y-1">
                  {typeof q.options === 'string' && q.options.split(',').map((option, idx) => (
                    <label key={idx} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option.trim()}
                        checked={answers[q.id] === option.trim()}
                        onChange={(e) =>
                          setAnswers({ ...answers, [q.id]: e.target.value })
                        }
                      />
                      <span>{option.trim()}</span>
                    </label>
                  ))}
                </div>
              ) : q.fieldType === 'file' ? (
                <FileUpload questionId={q.id} clientId="123WER" />
              ) : (
                <input
                  type={q.fieldType}
                  value={answers[q.id] || ''}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              )}
            </div>
          ))}
        </div>


        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>

    </div>
  );
}
