const Button = ({ className, text, textLoading, loading, ...rest }) => {
  return loading ? (
    <button className={`btn btn-${className}`} type='button' disabled>
      <span
        className="spinner-border spinner-border-sm me-2"
        role="status"
        aria-hidden="true"
      ></span>
      {textLoading} ...
    </button>
  ) : (
    <button className={`btn btn-${className}`} type='submit' {...rest}>
      {text}
    </button>
  );
};

export default Button;
