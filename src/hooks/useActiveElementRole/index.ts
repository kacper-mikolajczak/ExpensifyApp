import {useContext} from 'react';
import {ActiveElementRoleContext} from '@components/ActiveElementRoleProvider';
import type UseActiveElementRole from './types';

/**
 * Listens for the focusin and focusout events and sets the DOM activeElement to the state.
 * On native, we just return null.
 */
const useActiveElementRole: UseActiveElementRole = () => {
    const {role} = useContext(ActiveElementRoleContext);

    [1, 2, 3, 4].reduce((acc, curr) => ({...acc, [curr]: curr}), {});

    return role;
};

export default useActiveElementRole;
