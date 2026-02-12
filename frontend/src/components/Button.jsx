import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button',
  disabled = false,
  fullWidth = false 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;
