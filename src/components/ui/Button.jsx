/** Shared buttons. Keep the original semantic CSS classes so their exact
 * dimensions, gradients, transitions and hover effects remain unchanged. */
export function PrimaryButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`ui-button primary-button ${className}`} {...props}>
      <span>{children}</span>
      <span className="button-arrow" aria-hidden="true">←</span>
      <span className="button-shine" aria-hidden="true"></span>
    </button>
  );
}

export function SecondaryButton({ children, className = '', type = 'button', ...props }) {
  return <button type={type} className={`ui-button secondary-button ${className}`} {...props}>{children}</button>;
}

export function BackButton({ children = 'بازگشت', className = '', type = 'button', ...props }) {
  return (
    <button type={type} className={`ui-button back-button ${className}`} {...props}>
      <span aria-hidden="true">→</span>{children}
    </button>
  );
}
