/** @format */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

console.log("-- process.env.API_ENV", process.env.API_ENV);

const RootElement = document.getElementById("root");
if (RootElement) {
	const root = ReactDOM.createRoot(RootElement);
	root.render(
		<React.StrictMode>
			<App />
		</React.StrictMode>
	);
}
