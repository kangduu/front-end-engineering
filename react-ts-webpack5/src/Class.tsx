import React, { PureComponent } from "react";

function addAge(Target: Function) {
	Target.prototype.age = 10;
}

@addAge
class MyClass extends PureComponent {
	age?: number;
	render() {
		return (
			<>
				<h2>我是类组件--装饰器age: {this.age}</h2>
			</>
		);
	}
}

export default MyClass;
