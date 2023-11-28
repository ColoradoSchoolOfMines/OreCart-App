import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import Card from '../../components/card/card';
import './alerts-page.scss';


interface Alert {
  id: number;
  text: string;
  startDateTime: number;
  endDateTime: number;
}

interface AlertData {
  text: string;
  start_time: number;
  end_time: number;
}

interface AddAlertFormProps {
  onSubmit: (data: AlertData) => void; // or Promise<void> if async
  onCancel: () => void;
}

interface EditAlertFormProps {
  onSubmit: (data: AlertData) => void; // or Promise<void> if async
  onDelete: () => void;
  onCancel: () => void;
}

interface AlertEditFormMethods {
  setData: (alert: Alert) => void;
  clearForm: () => void;
}

const fetchAlerts = async () => {
  const response = await fetch('http://localhost:8000/alerts/');
  const data = await response.json();
  const alert_data = data as Alert[];
  return alert_data;
};

const AlertsPage: React.FC = () => {
  const { data: alerts, isLoading, error } = useQuery('alerts', fetchAlerts);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const dialogEditRef = useRef<HTMLDialogElement>(null);
  const [ currentAlertId, setCurrentAlertId ] = useState<number>(-1);
  const alertEditFormRef = useRef<AlertEditFormMethods>(null);

  const handleAddAlert = () => {
    dialogRef.current?.showModal();
  };

  const handleFormSubmit = async (formData: AlertData) => {
    try {
      const response = await fetch('http://localhost:8000/alerts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      queryClient.invalidateQueries('alerts');
      dialogRef.current?.close();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleEdit = (alertId: number) => {
    setCurrentAlertId(alertId);
    dialogEditRef.current?.showModal();
    alertEditFormRef.current?.clearForm();
    const alert = alerts?.find((alert: Alert) => alert.id === alertId);
    if (alert) {
      alertEditFormRef.current?.setData(alert);
    }
  };

  const handleEditSubmit = async (formData: AlertData) => {
    try {
      const response = await fetch(`http://localhost:8000/alerts/${currentAlertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      queryClient.invalidateQueries('alerts');
      setCurrentAlertId(-1);
      dialogEditRef.current?.close();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  const handleDeleteAlert = async () => {
    try {
      const response = await fetch(`http://localhost:8000/alerts/${currentAlertId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle the successful response
      queryClient.invalidateQueries('alerts');
      setCurrentAlertId(-1);
      dialogEditRef.current?.close();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred: {(error as Error).message}</div>;

  return (
    <main className='p-alerts-page'>
      <h1>Alerts</h1>
      <div className="cards-container">
        {alerts?.map((alert: Alert) => (
          <Card title={`Alert ${alert.id}`} key={alert.id} onClick={() => {handleEdit(alert.id)}}></Card>
        ))}
      </div>

      <button onClick={handleAddAlert}>Add Alert</button>

      <dialog ref={dialogRef}>
        <AddAlertForm onSubmit={handleFormSubmit} onCancel={() => {dialogRef.current?.close()}} />
      </dialog>

      <dialog ref={dialogEditRef}>
        <EditAlertForm ref={alertEditFormRef} onSubmit={handleEditSubmit} onCancel={() => {dialogEditRef.current?.close()}} onDelete={handleDeleteAlert} />
      </dialog>
    </main>
  );
};

const AddAlertForm: React.FC<AddAlertFormProps> = ({ onSubmit, onCancel }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const startTime = new Date(formData.get('start_time') as string);
    const endTime = new Date(formData.get('end_time') as string);
    const alertData: AlertData = {
      text: formData.get('text') as string,
      start_time: startTime.getTime() / 1000,
      end_time: endTime.getTime() / 1000,
    };

    onSubmit(alertData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Text</label>
      <input type="text" id="text" name="text" />
      <br />
      <label htmlFor="start_time">Start Time</label>
      <input type="datetime-local" id="start_time" name="start_time" />
      <br />
      <label htmlFor="end_time">End Time</label>
      <input type="datetime-local" id="end_time" name="end_time" />
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};


interface AlertEditFormRef {
  setData: (alert: Alert) => void;
  clearForm: () => void;
}

const EditAlertForm = forwardRef<AlertEditFormRef, EditAlertFormProps>(({ onSubmit, onCancel, onDelete }, ref) => {
  const textRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const startTime = new Date(formData.get('start_time') as string);
    const endTime = new Date(formData.get('end_time') as string);
    const alertData: AlertData = {
      text: formData.get('text') as string,
      start_time: startTime.getTime() / 1000,
      end_time: endTime.getTime() / 1000,
    };

    onSubmit(alertData);
  };

  const setData = (data: Alert) => {
    textRef.current!.value = data.text;
    startTimeRef.current!.value = (new Date(data.startDateTime*1000).toISOString().slice(0, 16));
    endTimeRef.current!.value = (new Date(data.endDateTime * 1000).toISOString().slice(0, 16));
  }

  const clearForm = () => {
    textRef.current!.value = '';
    startTimeRef.current!.value = '';
    endTimeRef.current!.value = '';
  };

  useImperativeHandle(ref, () => ({
    setData,
    clearForm,
  }));

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="text">Text</label>
      <input type="text" id="text" name="text" ref={textRef} />
      <br />
      <label htmlFor="start_time">Start Time</label>
      <input type="datetime-local" id="start_time" name="start_time" ref={startTimeRef} />
      <br />
      <label htmlFor="end_time">End Time</label>
      <input type="datetime-local" id="end_time" name="end_time" ref={endTimeRef} />
      <br />
      <button type="submit">Submit</button>
      <button type="button" onClick={onDelete}>Delete</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
});



export default AlertsPage;
