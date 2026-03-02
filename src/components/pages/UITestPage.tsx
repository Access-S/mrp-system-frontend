// src/components/pages/UITestPage.tsx
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import { Dialog } from "../ui/Dialog";

const UITestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        UI Test Page
      </h1>

      {/* Buttons Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Buttons
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={toggleModal}>Open Modal</Button>
          <Button color="green" onClick={() => alert("Clicked!")}>
            Success Button
          </Button>
        </div>
      </section>

      {/* Status Badges Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">
          Status Badges
        </h2>
        <div className="flex gap-2 flex-wrap">
          <StatusBadge status="Open" theme={{ isDark: false }} />
          <StatusBadge status="Completed" theme={{ isDark: false }} />
          <StatusBadge status="PO Check" theme={{ isDark: false }} />
          <StatusBadge status="Closed" theme={{ isDark: false }} />
        </div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onClose={toggleModal}>
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
            Test Modal
          </h3>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            This is a test modal content. You can put buttons, forms, or any component here.
          </p>
          <Button onClick={toggleModal}>Close</Button>
        </div>
      </Dialog>
    </div>
  );
};

export default UITestPage;