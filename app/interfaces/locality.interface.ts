export interface Locality {
    id: number;
    area: number | null;
    code: string | null;
    coordx: number;
    coordy: number;
    country: number;
    coordinate_system: string | null;
    depth: number;
    elevation: string; // Note: The JSON provides this as a string "21.50"
    epsg: number | null;
    latitude: number;
    land_board_id: string;
    longitude: number;
    name: string;
    name_en: string;
    number: string;
    municipality: number;
    remarks: string;
    remarks_location: string;
    stratigraphy_base_text: string | null;
    stratigraphy_top_text: string;
    coordinate_agent: number;
    coordinate_method: number | null;
    coordinate_precision: number | null;
    parent: number | null;
    type: number;
    settlement: number;
    stratigraphy_base: number;
    stratigraphy_top: number;
    date_added: string | null; // Usually ISO string or Date
    date_changed: string;       // ISO string e.g., "2022-11-21T21:13:22Z"
}