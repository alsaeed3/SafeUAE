import React from 'react';

const AlertFeed = ({ alerts }) => {
    const getAlertStyle = (priority) => {
        switch(priority) {
            case 3: return 'alert-critical';
            case 2: return 'alert-warning';
            default: return 'alert-info';
        }
    };

    return (
        <div className="alert-feed">
            <h3>Live Alerts</h3>
            {alerts.map((alert, index) => (
                <div key={index} className={`alert ${getAlertStyle(alert.priority)}`}>
                    <div className="alert-header">
                        <span className="alert-icon">⚠️</span>
                        <span className="alert-priority">Priority {alert.priority}</span>
                    </div>
                    <div className="alert-message">{alert.message}</div>
                    <div className="alert-location">{alert.location}</div>
                </div>
            ))}
        </div>
    );
};

export default AlertFeed;