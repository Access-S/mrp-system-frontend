// BLOCK 1: Imports
import React, { useState } from "react";
import {
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Drawer,
  Card,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  PaintBrushIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
  ArchiveBoxIcon,
  CubeIcon,
  ServerStackIcon,
  ChartBarSquareIcon,
  ClipboardDocumentListIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../contexts/ThemeContext";
import { themes } from "../styles/themes";
import { Page } from "../App";

// BLOCK 2: Types
interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

interface MenuItem {
  id: Page;
  label: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface MenuGroup {
  id: string;
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
}

// BLOCK 3: Menu Configuration
const MENU_GROUPS: MenuGroup[] = [
  {
    id: "operations",
    label: "Operations",
    icon: Cog6ToothIcon,
    items: [
      { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingBagIcon },
      { id: "inventory", label: "Inventory", icon: ArchiveBoxIcon },
    ],
  },
  {
    id: "insights",
    label: "Insights & Reporting",
    icon: ChartPieIcon,
    items: [
      { id: "analytics", label: "Analytics", icon: ChartBarSquareIcon, disabled: true },
      { id: "reporting", label: "Reporting", icon: DocumentTextIcon, disabled: true },
    ],
  },
  {
    id: "system-data",
    label: "System Data",
    icon: ServerStackIcon,
    items: [
      { id: "products", label: "Products (BOM)", icon: CubeIcon },
      { id: "forecasts", label: "Forecasts", icon: ChartBarSquareIcon },
      { id: "soh", label: "Stock on Hand", icon: ClipboardDocumentListIcon },
    ],
  },
];

const SETTINGS_ITEMS = ["General", "Notifications", "Privacy"];

// BLOCK 4: Component
export function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const [openAccordion, setOpenAccordion] = useState<string>("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { theme, themeName, setThemeName } = useTheme();

  const toggleAccordion = (value: string) => {
    setOpenAccordion(openAccordion === value ? "" : value);
  };

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    setIsDrawerOpen(false);
  };

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const onClick = (page: Page) => (isMobile ? () => handleNavClick(page) : () => setActivePage(page));

    return (
      <>
        <div className="mb-6 flex items-center gap-4 p-4">
          <div className={`h-8 w-8 rounded-lg ${theme.isDark ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center text-white font-bold text-sm`}>
            MRP
          </div>
          <Typography variant="h5" className={theme.sidebarText}>
            MRP System
          </Typography>
        </div>

        <div className="flex-1">
          <List className={theme.sidebarText}>
            <ListItem onClick={onClick("dashboard")} selected={activePage === "dashboard"}>
              <ListItemPrefix>
                <PresentationChartBarIcon className={`h-5 w-5 ${theme.sidebarText}`} />
              </ListItemPrefix>
              <Typography className={`mr-auto font-normal ${theme.sidebarText}`}>Dashboard</Typography>
            </ListItem>

            {MENU_GROUPS.map((group) => (
              <Accordion
                key={group.id}
                open={openAccordion === group.id}
                icon={
                  <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${openAccordion === group.id ? "rotate-180" : ""}`}
                  />
                }
              >
                <ListItem className="p-0" selected={openAccordion === group.id}>
                  <AccordionHeader onClick={() => toggleAccordion(group.id)} className="border-b-0 p-3">
                    <ListItemPrefix>
                      <group.icon className={`h-5 w-5 ${theme.sidebarText}`} />
                    </ListItemPrefix>
                    <Typography className={`mr-auto font-normal ${theme.sidebarText}`}>{group.label}</Typography>
                  </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                  <List className="p-0 pl-4">
                    {group.items.map((item) => (
                      <ListItem
                        key={item.id}
                        onClick={onClick(item.id)}
                        selected={activePage === item.id}
                        disabled={item.disabled}
                      >
                        <ListItemPrefix>
                          <item.icon className={`h-4 w-4 ${theme.sidebarText}`} />
                        </ListItemPrefix>
                        {item.label}
                      </ListItem>
                    ))}
                  </List>
                </AccordionBody>
              </Accordion>
            ))}
          </List>
        </div>

        <div className="mt-auto">
          <hr className={`my-4 ${theme.isDark ? 'border-slate-700' : 'border-gray-300'}`} />
          <List className={theme.sidebarText}>
            <ListItem>
              <ListItemPrefix>
                <UserCircleIcon className={`h-5 w-5 ${theme.sidebarText}`} />
              </ListItemPrefix>
              Profile
            </ListItem>

            <Accordion
              open={openAccordion === "settings"}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${openAccordion === "settings" ? "rotate-180" : ""}`}
                />
              }
            >
              <ListItem className="p-0" selected={openAccordion === "settings"}>
                <AccordionHeader onClick={() => toggleAccordion("settings")} className="border-b-0 p-3">
                  <ListItemPrefix>
                    <Cog6ToothIcon className={`h-5 w-5 ${theme.sidebarText}`} />
                  </ListItemPrefix>
                  <Typography className={`mr-auto font-normal ${theme.sidebarText}`}>Settings</Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  {SETTINGS_ITEMS.map((item) => (
                    <ListItem key={item}>
                      <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className={`h-3 w-5 ${theme.sidebarText}`} />
                      </ListItemPrefix>
                      {item}
                    </ListItem>
                  ))}

                  <Accordion
                    open={settingsOpen}
                    icon={
                      <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`mx-auto h-3 w-3 transition-transform ${settingsOpen ? "rotate-180" : ""}`}
                      />
                    }
                  >
                    <ListItem className="p-0 pl-4" selected={settingsOpen}>
                      <AccordionHeader onClick={() => setSettingsOpen(!settingsOpen)} className="border-b-0 p-2">
                        <ListItemPrefix>
                          <PaintBrushIcon className={`h-4 w-4 ${theme.sidebarText}`} />
                        </ListItemPrefix>
                        <Typography className={`mr-auto font-normal text-sm ${theme.sidebarText}`}>Themes</Typography>
                      </AccordionHeader>
                    </ListItem>
                    <AccordionBody className="py-1">
                      <List className="p-0 pl-4">
                        {Object.entries(themes).map(([key, themeOption]) => (
                          <ListItem
                            key={key}
                            className={`${theme.sidebarText} pl-8 py-2 ${themeName === key ? (theme.isDark ? "bg-gray-700" : theme.activeRowBg) : ""}`}
                            onClick={() => setThemeName(key as keyof typeof themes)}
                          >
                            <ListItemPrefix>
                              <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 border-2 ${theme.isDark ? "border-gray-400" : "border-gray-700"}`}>
                                <div className={`w-2 h-2 rounded-full transition-transform duration-200 ${theme.isDark ? "bg-gray-200" : "bg-gray-800"} ${themeName === key ? "scale-100" : "scale-0"}`} />
                              </div>
                            </ListItemPrefix>
                            <Typography className={`text-xs ${theme.sidebarText} ${themeName === key ? "font-medium" : ""}`}>
                              {themeOption.name}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </AccordionBody>
                  </Accordion>
                </List>
              </AccordionBody>
            </Accordion>

            <ListItem>
              <ListItemPrefix>
                <PowerIcon className={`h-5 w-5 ${theme.sidebarText}`} />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </div>
      </>
    );
  };

  return (
    <>
      <IconButton
        variant="text"
        size="lg"
        onClick={() => setIsDrawerOpen(true)}
        className={`${theme.text} lg:hidden fixed top-4 left-4 z-50`}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="h-8 w-8 stroke-2" />
      </IconButton>

      <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} className="lg:hidden">
        <div className={`h-full w-full ${theme.cards}`}>
          <Card color="transparent" shadow={false} className={`h-full w-full p-4 ${theme.cards} flex flex-col overflow-y-auto rounded-none`}>
            <div className="flex justify-end mb-2">
              <IconButton variant="text" onClick={() => setIsDrawerOpen(false)} aria-label="Close sidebar">
                <XMarkIcon className="h-6 w-6" />
              </IconButton>
            </div>
            <NavContent isMobile />
          </Card>
        </div>
      </Drawer>

      <aside className={`hidden lg:flex flex-col w-64 ${theme.cards} border-r ${theme.isDark ? 'border-slate-700' : 'border-slate-200'} h-screen sticky top-0 overflow-y-auto`}>
        <NavContent />
      </aside>
    </>
  );
}