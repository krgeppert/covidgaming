import * as React from "react";
import { ComponentType, FunctionComponent, useState } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { RoomPage } from "./pages/RoomPage";
import { createBrowserHistory, History } from "history";

export interface RouterProps {
    history: History;
}

export interface RouteConf {
    path: string;
    exact?: boolean;
    title?: string | ((url: URL) => string);
    component: ComponentType<RouterProps>;
}

export const routes = {
    map: {
        path: "/room",
        component: RoomPage
    },
    home: {
        path: "/",
        exact: true,
        component: HomePage
    }
};

const Internal: FunctionComponent = () => {
    const history = useHistory();
    return (
        <Switch>
            {Object.values(routes).map((route: RouteConf) => {
                const Child = route.component;
                return (
                    <Route
                        key={route.path}
                        path={route.path}
                        exact={route.exact}
                    >
                        <Child history={history} />
                    </Route>
                );
            })}
        </Switch>
    );
};

export const Router: FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Internal />
        </BrowserRouter>
    );
};
