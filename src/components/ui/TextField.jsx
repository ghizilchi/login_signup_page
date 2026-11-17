import FieldShell from './FieldShell.jsx';

/** Shared text field used by signup and login screens. */
export default function TextField({
  id, label, value, onChange, error, isValid, type = 'text',
  wrapperClassName = '', inputClassName = '', showStateIcon = true,
  fieldClassName = '', ...inputProps
}) {
  return (
    <FieldShell id={id} label={label} error={error} isValid={isValid} className={fieldClassName}>
      {(stateClass, extraWrapperClass) => (
        <div className={`input-wrapper ${stateClass} ${wrapperClassName} ${extraWrapperClass}`.trim()}>
          <input id={id} name={id} type={type} value={value} onChange={onChange}
            aria-invalid={Boolean(error)} className={`ui-field-control ${inputClassName}`.trim()} {...inputProps} />
          {showStateIcon && <span className="input-state-icon" aria-hidden="true"></span>}
        </div>
      )}
    </FieldShell>
  );
}
