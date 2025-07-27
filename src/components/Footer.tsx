import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
                &copy; {new Date().getFullYear()} IoT Dashboard. All Rights Reserved.
            </div>
        </footer>
    );
};
