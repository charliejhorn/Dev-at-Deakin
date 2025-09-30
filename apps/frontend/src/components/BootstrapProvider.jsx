// This file ensures Bootstrap is loaded globally for the app.
import 'bootstrap/dist/css/bootstrap.min.css';

export default function BootstrapProvider({ children }) {
	return children;
}
