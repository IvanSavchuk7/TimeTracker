import {useSelector, TypedUseSelectorHook, useDispatch} from 'react-redux';
import {AppDispatch, RootState} from '../redux';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch