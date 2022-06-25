
export interface UseBackupReturnValues {
    isBackedUp: boolean;
}

export function useBackup(): UseBackupReturnValues {
    return {isBackedUp: false};
}
