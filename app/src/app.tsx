import * as ReactDOM from "react-dom";
import * as React from "react";
import { Router } from "./components/Router";
import { CssBaseline } from "@material-ui/core";

const rootNode: HTMLElement = document.createElement("div")!;
document.body.appendChild(rootNode);

ReactDOM.render(
    <>
        <CssBaseline />
        <Router />
    </>,
    rootNode
);
