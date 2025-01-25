// src/frontend/src/components/Dashboard.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Panel = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  background: ${props => props.status === 'connected' ? '#4caf50' : '#f44336'};
  color: white;
`;

const Dashboard = () => {
  const [incidents, setIncidents] = useState([]);
  const [sensorData, setSensorData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [resources, setResources] = useState({});
  const [wsStatus, setWsStatus] = useState('disconnected');

  const connectWebSocket = useCallback(() => {
    const ws = new W3CWebSocket('ws://localhost:8000/ws');

    ws.onopen = () => {
      setWsStatus('connected');
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);
        switch(data.type) {
          case 'incident':
            setIncidents(prev => [...prev.slice(-9), data]);
            break;
          case 'sensor_agg':
            setSensorData(prev => [...prev.slice(-9), data]);
            break;
          case 'prediction':
            setPredictions(prev => [...prev.slice(-4), data]);
            break;
          case 'allocation':
            setResources(prev => ({...prev, ...data.deployment}));
            break;
          default:
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      setTimeout(connectWebSocket, 5000);
    };

    return ws;
  }, []);

  useEffect(() => {
    const ws = connectWebSocket();
    return () => ws.close();
  }, [connectWebSocket]);

  return (
    <DashboardContainer>
      <Panel>
        <h2>System Status</h2>
        <StatusBadge status={wsStatus}>
          {wsStatus.toUpperCase()}
        </StatusBadge>
      </Panel>

      <Panel>
        <h2>Recent Incidents</h2>
        {incidents.map((incident, idx) => (
          <div key={idx} className={`alert alert-${incident.priority === 3 ? 'critical' : 'warning'}`}>
            <p>{incident.text}</p>
            <small>Location: {incident.location}</small>
          </div>
        ))}
      </Panel>

      <Panel>
        <h2>Sensor Readings</h2>
        {sensorData.map((sensor, idx) => (
          <div key={idx}>
            <p>Status: {sensor.status}</p>
            <p>Location: {sensor.location}</p>
            <small>{new Date(sensor.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </Panel>

      <Panel>
        <h2>Predictions</h2>
        {predictions.map((pred, idx) => (
          <div key={idx}>
            <p>Spread Rate: {pred.spread_rate} units/hour</p>
            <p>Est. Impact: {pred.estimated_impact} people</p>
          </div>
        ))}
      </Panel>

      <Panel>
        <h2>Resource Allocation</h2>
        {Object.entries(resources).map(([unit, count]) => (
          <div key={unit}>
            <p>{unit.replace('_', ' ')}: {count}</p>
            <progress value={count} max={20} />
          </div>
        ))}
      </Panel>
    </DashboardContainer>
  );
};

export default Dashboard;