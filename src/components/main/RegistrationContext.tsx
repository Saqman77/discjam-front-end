import { createContext, useReducer, useContext, ReactNode } from "react";
import {RegistrationAction, RegistrationContext, registrationInitializer, registrationReducer} from './RegistrationReducer';

interface RegistrationProviderProps {
    children: ReactNode;
}

interface RegistrationContextValue {
    state: RegistrationContext;
    dispatch: React.Dispatch<RegistrationAction>;
}

const RegistrationContextInstance = createContext<RegistrationContextValue | undefined>(
    undefined
)

export const RegistrationProvider = ({ children }: RegistrationProviderProps) => {
    const [state, dispatch] = useReducer(
        registrationReducer,
        registrationInitializer()
    );

    return (
        <RegistrationContextInstance.Provider 
            value={{
                state,
                dispatch
            }}
        >
            {children}
        </RegistrationContextInstance.Provider>
    )
};

export function useRegistrationContext() {
    const context = useContext(RegistrationContextInstance);

    if (!context) {
        throw new Error(
            'useRegistrationContext must be used within RegistrationProvider'
        );
    }

    return context;
}