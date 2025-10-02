export function ErrorSubtext({ message }: { message: string }) {
    return (
        <p className="sm font-semibold !text-red-600 ml-4 mb-4">
            Error: {message}
        </p>
    );
}