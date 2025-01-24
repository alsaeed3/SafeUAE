import React, { useEffect, useState, useCallback } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const AlertSection = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const ResourceSection = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const Dashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [resources, setResources] = useState({});
  const [wsStatus, setWsStatus] = useState('disconnected');

  const connectWebSocket = useCallback(() => {
    const ws = new W3CWebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      setWsStatus('connected');
      console.log('WebSocket Connected');
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      console.log('WebSocket Disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        if (data.type === 'alert') {
          setAlerts(prev => [...prev.slice(-9), data]); // Keep last 10 alerts
        } else if (data.type === 'resource') {
          setResources(data.resources);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setWsStatus('error');
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => {
      ws.close();
    };
  }, [connectWebSocket]);

  return (
    <DashboardContainer>
      <AlertSection>
        <h2>System Alerts</h2>
        <div>Connection Status: {wsStatus}</div>
        {alerts.map((alert, index) => (
          <div key={index}>
            <p>{alert.message}</p>
            <small>{new Date(alert.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </AlertSection>
      <ResourceSection>
        <h2>System Resources</h2>
        {Object.entries(resources).map(([key, value]) => (
          <div key={key}>
            <p>{key}: {value}%</p>
            <progress value={value} max="100" />
          </div>
        ))}
      </ResourceSection>
    </DashboardContainer>
  );
};

export default Dashboard;