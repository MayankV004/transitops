"use client";

import { useState } from "react";
import { createVehicle } from "@/actions/vehicle.actions";

export function AddVehicleModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      regNumber: formData.get("regNumber") as string,
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      maxLoadKg: Number(formData.get("maxLoadKg")),
      acquisitionCost: Number(formData.get("acquisitionCost")),
    };

    const result = await createVehicle(data);

    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || "Something went wrong");
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-primary">
        + Add Vehicle
      </button>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add Vehicle</h2>
          <button onClick={() => setIsOpen(false)} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Registration Number</label>
            <input type="text" name="regNumber" required placeholder="e.g. GJ01AB4521" />
          </div>

          <div className="form-group">
            <label>Name/Mode</label>
            <input type="text" name="name" required placeholder="e.g. VAN-05" />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="type" required>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Mini">Mini</option>
            </select>
          </div>

          <div className="form-group">
            <label>Capacity (kg)</label>
            <input type="number" name="maxLoadKg" required placeholder="500" min="1" />
          </div>

          <div className="form-group">
            <label>Acquisition Cost</label>
            <input type="number" name="acquisitionCost" required placeholder="620000" min="1" />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Adding..." : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .btn-primary {
          background: #b48a58;
          color: #fff;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          opacity: 0.9;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
        }

        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .modal-content {
          background: #09090b;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          width: 100%;
          max-width: 400px;
          padding: 1.5rem;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 1.25rem;
          color: #f8fafc;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem;
          color: #cbd5e1;
          font-weight: 500;
        }
        .form-group input, .form-group select {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 0.5rem;
          border-radius: 0.375rem;
          font-family: inherit;
        }
        .form-group select option {
          background: #09090b;
          color: #fff;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #b48a58;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}
