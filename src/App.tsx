import { ComponentType } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { IonApp, IonLoading, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import RankingPage from './pages/RankingPage';

setupIonicReact();

type GuardRouteProps = RouteProps & {
  component: ComponentType<any>;
};

const PrivateRoute = ({ component: Component, ...rest }: GuardRouteProps) => {
  const { user, loadingAuth } = useApp();

  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (loadingAuth) {
          return <IonLoading isOpen message="Cargando..." />;
        }
        if (!user) {
          return <Redirect to="/login" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const PublicRoute = ({ component: Component, ...rest }: GuardRouteProps) => {
  const { user, loadingAuth } = useApp();

  return (
    <Route
      {...rest}
      render={(props: any) => {
        if (loadingAuth) {
          return <IonLoading isOpen message="Cargando..." />;
        }
        if (user) {
          return <Redirect to="/home" />;
        }
        return <Component {...props} />;
      }}
    />
  );
};

const AppRoutes = () => {
  return (
    <IonReactRouter>
      <PublicRoute exact path="/login" component={LoginPage} />
      <PublicRoute exact path="/register" component={RegisterPage} />
      <PrivateRoute exact path="/home" component={HomePage} />
      <PrivateRoute exact path="/results" component={ResultsPage} />
      <PrivateRoute exact path="/ranking" component={RankingPage} />
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </IonReactRouter>
  );
};

const App = () => {
  return (
    <IonApp>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </IonApp>
  );
};

export default App;
