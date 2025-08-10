export type RirekishoData = {
    name: string;
    education?: { from: string; to?: string; school: string; note?: string }[];
    work?: { from: string; to?: string; company: string; role?: string; note?: string }[];
    // other fields...
};

// This is the current template structure:
// 1. Education entries are rendered first
// 2. Work entries are rendered after education  
// 3. Empty rows fill the remaining space

// The current behavior when adding:
// - Education Add: adds to end of education array
// - Work Add: adds to end of work array

// The user wants: 
// When any add button is clicked, the new entry should appear in the LAST ROW of the table
// This means work entries should ALWAYS appear last since they render after education entries

// Simple solution:
// - Education Add: should add to WORK array (so it appears last)
// - Work Add: should add to WORK array (so it appears last)

// OR restructure to show them in chronological order but that's complex
