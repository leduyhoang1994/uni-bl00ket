export default function AccessDenied() {
  return (
    <div className="access-denied">
      <div className="access-denied__content">
        <h1 className="access-denied__title">Access Denied</h1>
        <p className="access-denied__message">
          You do not have permission to access this page.
        </p>
        <p className="access-denied__instruction">
          Please ensure you have a valid access token.
        </p>
      </div>
    </div>
  );
}
