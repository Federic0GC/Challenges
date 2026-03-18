import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Login from './pages/Login';
import Register from './pages/Register';
import AddEditTask from './pages/AddEditTask';
import TaskDetail from './pages/TaskDetail';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthProvider>
      <TasksProvider>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/tasks">
            <Tab1 />
          </Route>
          <Route exact path="/tasks/new">
            <AddEditTask />
          </Route>
          <Route exact path="/tasks/detail/:id">
            <TaskDetail />
          </Route>
          <Route exact path="/tasks/:id/edit">
            <AddEditTask />
          </Route>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/edittasks">
            <Tab2 />
          </Route>
          <Route path="/detailtasks">
            <Tab3 />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tasks" href="/tasks">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Tasks</IonLabel>
          </IonTabButton>
          <IonTabButton tab="edit" href="/edittasks">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Edit</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tab3" href="/detailtasks">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Details</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
      </TasksProvider>
      </AuthProvider>
    </IonReactRouter>
  </IonApp>
);

export default App;
