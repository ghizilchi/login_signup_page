/** Shared field layout for standard, password and verification inputs.
 * Keeps the original DOM hooks/classes so legacy visual rules remain exact. */
export default function FieldShell({
  id, label, error, isValid, className = '', wrapperClassName = '',
  wrapperId, hidden, children, afterError,
}) {
  const stateClass = error ? 'error' : (isValid ? 'valid' : '');
  return (
    <div id={wrapperId} hidden={hidden} className={`input-group ${className}`.trim()}>
      {label && <label htmlFor={id}>{label}</label>}
      {children(stateClass, wrapperClassName)}
      <small className="error-message">{error || ''}</small>
      {afterError}
    </div>
  );
}
