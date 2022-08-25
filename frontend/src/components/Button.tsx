import type { HTMLAttributes } from "react";
import "../styles/button.scss"

const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
	return (
		<button {...{...props, className: "c_button " + (props.className ? props.className : "")}} >
			{ props.children }
		</button>
	)
}

export default Button;