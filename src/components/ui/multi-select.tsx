import * as React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface MultiSelectProps {
    options: { value: string; label: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selected, onChange, className }) => {
    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    return (
        <Select onValueChange={handleSelect} value="">
            <SelectTrigger className={className}>
                <SelectValue placeholder="Select sensors..." />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value} >
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selected.includes(option.value)}
                                readOnly
                                className="mr-2"
                            />
                            {option.label}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};