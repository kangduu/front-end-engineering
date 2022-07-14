import React, { FC } from "react";
import MyClass from "./Class";
import "./app.css";
import "./styles.less";

const App: FC<any> = (props: any) => {
	return (
		<>
			<h1> Welcome to React</h1>;
			<MyClass />
		</>
	);
};

export default App;
