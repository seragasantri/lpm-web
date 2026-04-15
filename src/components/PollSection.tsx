import { useState } from 'react';
import { PieChart, CheckCircle } from 'lucide-react';
import { pollOptions } from '../data';
import './PollSection.css';

export default function PollSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selected !== null) {
      setSubmitted(true);
    }
  };

  return (
    <div className="poll-section">
      <div className="poll-header">
        <PieChart size={20} className="poll-header-icon" />
        <h3 className="poll-title">Jajak Pendapat</h3>
      </div>

      <div className="poll-content">
        <p className="poll-question">
          Bagaimana Pendapat Anda tentang Website LPM UIN Raden Fatah ini?
        </p>

        {!submitted ? (
          <>
            <div className="poll-options">
              {pollOptions.map((option) => (
                <label key={option.id} className={`poll-option ${selected === option.id ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="poll"
                    value={option.id}
                    checked={selected === option.id}
                    onChange={() => setSelected(option.id)}
                  />
                  <span className="poll-option-label">{option.label}</span>
                </label>
              ))}
            </div>
            <button
              className="poll-submit"
              onClick={handleSubmit}
              disabled={selected === null}
            >
              Kirim Jawaban
            </button>
          </>
        ) : (
          <div className="poll-success">
            <CheckCircle size={32} className="poll-success-icon" />
            <p>Terima kasih atas partisipasi Anda!</p>
            <span className="poll-success-vote">
              Anda memilih: <strong>{pollOptions.find(o => o.id === selected)?.label}</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
