import { BrowserRouter, Routes, Route} from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import HomeView from './views/HomeView'
import InventoryView from './views/InventoryView'
import SearchView from './views/SearchView'
import BookView from './views/BookView'
import LoginView from './views/LoginView'
import CreateBookView from './views/CreateBookView'
import EditBookView from './views/EditBookView'
import NotFoundView from './views/NotFoundView'
import LocationView from './views/LocationView'

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path='/' element={<HomeView />} index />
                    <Route path='/inventory' element={<InventoryView />} />
                    <Route path='/search/:keyword' element={<SearchView />} />
                    <Route path='/book/:isbn' element={<BookView />} />
                    <Route path='/book/create' element={<CreateBookView />} />
                    <Route path='/book/:isbn/edit' element={<EditBookView />} />
                    <Route path='/location' element={<LocationView />} />
                    <Route path='/login' element={<LoginView />} />
                    <Route path='*' element={<NotFoundView />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router