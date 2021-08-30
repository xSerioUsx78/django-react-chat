import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="mt-5 d-flex align-items-center justify-content-center h-100 w-100 container-xxl">
      <div>
        <h1 className="text-info mb-2">404!</h1>
        <h4 className="mb-2">We couldent find anything in this url!</h4>
        <h6>
          <Link to="/">Back to home</Link>
        </h6>
      </div>
    </div>
  );
};

export default NotFound;
