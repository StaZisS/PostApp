import {BrowserRouter, Route, Routes} from "react-router-dom";
import {PostPage} from "@/pages/PostPage/ui/PostPage";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import PostInfoPage from "@/pages/PostInfoPage/ui/PostInfoPage";
import ProfilePage from "@/pages/ProfilePage/ui/ProfilePage";
import {Header} from "@/modules/Header/ui/Header";
import LoginPage from "@/pages/LoginPage/ui/LoginPage";
import RegistrationPage from "@/pages/RegistrationPage/ui/RegistrationPage";
import PrivateRoute from "./PrivateRouter";
import Footer from "@/shared/components/Footer/Footer";
import {AuthorsPage} from "@/pages/AutorPage/ui/AuthorsPage.tsx";
import {GroupPage} from "@/pages/GroupPage/ui/GroupPage.tsx";
import CommunitiePage from "@/pages/CommunitiePage/ui/CommunitiePage.tsx";
import PostCreationPage from "@/pages/PostCreationPage/ui/PostCreationPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Provider store={store}>
                <Header/>

                <Routes>
                    <Route path="" element={<PostPage/>}/>
                    <Route path="/authors/" element={<AuthorsPage/>}/>
                    <Route path="/item/:postId" element={<PostInfoPage/>}/>
                    <Route path="communities/:id/post" element={<CommunitiePage/>}/>
                    <Route path="/communities/" element={<GroupPage/>}/>
                    <Route path="/registration/" element={<RegistrationPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route
                        path="/post/create"
                        element={
                            <PrivateRoute>
                                {" "}
                                <PostCreationPage/>{" "}
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                {" "}
                                <ProfilePage/>{" "}
                            </PrivateRoute>
                        }
                    />
                </Routes>
                <Footer/>
            </Provider>
        </BrowserRouter>
    );
}

export default App;
