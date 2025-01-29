import JsonInput from "@/components/JsonInputField";
import JsonInputWithFields from "@/extra/JsonInputWithFields";
import ZodBuilder from "@/extra/ZodBuilder";

const TestPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <h1>Test Page</h1>
            <JsonInput onChange={function (): void {
                throw new Error("Function not implemented.");
            } } />
            <ZodBuilder />
            <JsonInputWithFields />
        </div>
    );
}

export default TestPage;