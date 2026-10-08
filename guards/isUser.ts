interface IUser {
    name: string;
};

export const isUser = (value: unknown): value is IUser => {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        'name' in value &&
        typeof value.name === 'string' &&
        Boolean(value.name.trim()) &&
        Object.keys(value).length === 1
  );
}