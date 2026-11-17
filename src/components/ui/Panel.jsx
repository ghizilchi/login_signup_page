/**
 * Shared semantic surface wrapper.
 * Visual styling intentionally remains in the existing page-specific CSS;
 * this component centralizes the React markup and exposes stable variant hooks.
 */
export default function Panel({
  as: Element = 'div',
  variant = 'default',
  className = '',
  children,
  ...props
}) {
  return (
    <Element
      className={`ui-panel ui-panel--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </Element>
  );
}
