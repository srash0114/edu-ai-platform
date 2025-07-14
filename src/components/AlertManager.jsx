import AlertButton from './AlertButton.jsx';

const AlertManager = ({ alerts, removeAlert }) => {
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 flex flex-col gap-2 w-full max-w-md">
                {alerts.map((alert, index) => (
                    <AlertButton
                        key={alert.id}
                        id={alert.id}
                        type={alert.type}
                        message={alert.message}
                        onClose={removeAlert}
                        className="shadow-lg"
                        style={{ transform: `translateY(${index * 60}px)` }}
                    />
                ))}
        </div>
    );
};

export default AlertManager;