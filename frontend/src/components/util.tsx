import React, { createContext, ReactPropTypes, useEffect, useRef } from "react";
import { Link, LinkProps } from "react-router-dom";
import Cookies from 'universal-cookie'

export function useEffectOnce(effect: React.EffectCallback) {
	let ref = useRef(true);

	useEffect(() => {
		if (ref.current) {
			ref.current = false;
			return effect();
		}
	}, []);
}

export class MyCookies extends Cookies {
	setFromObj: Function = (obj: any, path: string | undefined) => {
		for (var key in obj) {
			this.set(key, obj[key], path ? { path } : undefined)
		}
	};
	constructor() {
		super()
	}
}

export const cookies = new MyCookies();

export const globalContext = createContext({loggedIn: false, setLoggedIn: (val: boolean) => {}});

export function ShowConditionally(props: any) {
	let children = props.children;
	let one, two;

	one = <></>;
	two = <></>;
	if (Array.isArray(children)) {
		if (children[0])
			one = children[0];
		if (children[1])
			two = children[1];
	}
	else if (children) {
		one = children;
	}
	return (
		<>
			{
				props.cond ? one : two
			}
		</>
	);
}

export function isLoggedIn() {
	// return true;
	return cookies.get("_token");
}

export function RRLink(props: LinkProps & React.RefAttributes<HTMLAnchorElement>) {
	// console.log("RRLink props:")
	// console.log({props});
	return <Link {...{...props, className: "no-underline no-colors " + props.className}}></Link>
}

export function valDef(obj: any, def: any) { 
	if (obj == null || obj == undefined)
		return def;
	return obj;
}

export function generateCookie(key: string, value: string) {
	return key + '=' + value + ';';
}

export function getCookieHeader() {
	return generateCookie("_token", cookies.get("_token"));
}


export function capitalize(str: string) {
	return str[0].toUpperCase() + str.substring(1);
}

export function deepcopy(obj: Object) {
	return JSON.parse(JSON.stringify(obj));
}