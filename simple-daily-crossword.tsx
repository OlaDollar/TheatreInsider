import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Grid3X3, Eye, EyeOff, TicketIcon } from "lucide-react";

interface CrosswordClue {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  answer: string;
  startRow: number;
  startCol: number;
  length: number;
}

interface CrosswordPuzzle {
  id: string;
  date: string;
  difficulty: string;
  title: string;
  grid: string[][];
  solution?: string[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
  size: number;
}

export default function SimpleDailyCrossword() {
  const isAuthenticated = false; // For now, will implement auth later
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>('00:00');
  const [showSolution, setShowSolution] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [showTicketCTAs, setShowTicketCTAs] = useState(true);

  const { data: crossword, isLoading, error } = useQuery<CrosswordPuzzle>({
    queryKey: ['/api/crossword/today', difficulty],
    queryFn: async () => {
      console.log(`Fetching crossword with difficulty: ${difficulty}`);
      const response = await fetch(`/api/crossword/today?difficulty=${difficulty}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Crossword data received:', data);
      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Check solution availability
  const { data: solutionAvailability } = useQuery({
    queryKey: ['/api/crossword/solution-available'],
    queryFn: () => fetch('/api/crossword/solution-available').then(res => res.json()),
    retry: false,
  });

  // Load saved answers
  useEffect(() => {
    if (crossword?.id) {
      const savedAnswers = localStorage.getItem(`crossword_${crossword.id}`);
      if (savedAnswers) {
        const parsed = JSON.parse(savedAnswers);
        const now = new Date().getTime();
        const maxAge = isAuthenticated ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days or 1 day
        
        if (now - parsed.timestamp < maxAge) {
          setUserAnswers(parsed.answers);
        }
      }
    }
  }, [crossword?.id, isAuthenticated]);

  // Save answers automatically
  const saveAnswers = useMutation({
    mutationFn: async () => {
      if (!crossword?.id) return;
      const data = {
        answers: userAnswers,
        timestamp: new Date().getTime()
      };
      localStorage.setItem(`crossword_${crossword.id}`, JSON.stringify(data));
    }
  });

  // Auto-save on answer change
  useEffect(() => {
    if (Object.keys(userAnswers).length > 0) {
      const timeoutId = setTimeout(() => {
        saveAnswers.mutate();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [userAnswers]);

  // Timer effect
  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - startTime.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);

  // Start timer on first input
  useEffect(() => {
    if (!startTime && Object.keys(userAnswers).length > 0) {
      setStartTime(new Date());
    }
  }, [userAnswers, startTime]);

  // Get current clues list
  const currentClues = useMemo(() => {
    if (!crossword?.clues) return [];
    return currentDirection === 'across' ? crossword.clues.across : crossword.clues.down;
  }, [crossword?.clues, currentDirection]);

  // Get current clue
  const currentClue = useMemo(() => {
    return currentClues[currentClueIndex] || null;
  }, [currentClues, currentClueIndex]);

  // Get highlighted cells for current clue
  const highlightedCells = useMemo(() => {
    if (!currentClue) return new Set<string>();
    
    const cells = new Set<string>();
    for (let i = 0; i < currentClue.length; i++) {
      const row = currentDirection === 'across' ? currentClue.startRow : currentClue.startRow + i;
      const col = currentDirection === 'across' ? currentClue.startCol + i : currentClue.startCol;
      cells.add(`${row}-${col}`);
    }
    return cells;
  }, [currentClue, currentDirection]);

  // Check if a word is completed correctly
  const isWordCompleted = useCallback((clue: CrosswordClue) => {
    for (let i = 0; i < clue.length; i++) {
      const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
      const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
      const cellKey = `${row}-${col}`;
      const userValue = userAnswers[cellKey] || '';
      const correctValue = clue.answer[i] || '';
      if (userValue !== correctValue) return false;
    }
    return true;
  }, [userAnswers]);

  // Get completed theatre shows for CTAs
  const completedShows = useMemo(() => {
    if (!crossword?.clues) return [];
    const allClues = [...crossword.clues.across, ...crossword.clues.down];
    const theatreShows = ['LIONKING', 'ANNIE', 'BEAUTYANDTHEBEAST', 'PHANTOM', 'CHICAGO', 'WICKED', 'HAMILTON'];
    
    return allClues.filter(clue => 
      theatreShows.includes(clue.answer.replace(/\s/g, '')) && isWordCompleted(clue)
    );
  }, [crossword?.clues, isWordCompleted]);

  const handleCellInput = (row: number, col: number, value: string) => {
    const cellKey = `${row}-${col}`;
    setUserAnswers(prev => ({
      ...prev,
      [cellKey]: value.toUpperCase()
    }));
  };

  const onScreenKeyboardPress = (key: string) => {
    if (!currentClue) return;
    
    if (key === 'BACKSPACE') {
      // Find last filled cell to clear
      for (let i = currentClue.length - 1; i >= 0; i--) {
        const row = currentDirection === 'across' ? currentClue.startRow : currentClue.startRow + i;
        const col = currentDirection === 'across' ? currentClue.startCol + i : currentClue.startCol;
        const cellKey = `${row}-${col}`;
        
        if (userAnswers[cellKey] && userAnswers[cellKey] !== '') {
          handleCellInput(row, col, '');
          setSelectedCell({ row, col });
          break;
        }
      }
      return;
    }
    
    // Find first empty cell in current clue
    for (let i = 0; i < currentClue.length; i++) {
      const row = currentDirection === 'across' ? currentClue.startRow : currentClue.startRow + i;
      const col = currentDirection === 'across' ? currentClue.startCol + i : currentClue.startCol;
      const cellKey = `${row}-${col}`;
      
      if (!userAnswers[cellKey] || userAnswers[cellKey] === '') {
        handleCellInput(row, col, key);
        setSelectedCell({ row, col });
        break;
      }
    }
  };

  const goToNextClue = useCallback(() => {
    if (currentClueIndex < currentClues.length - 1) {
      const newIndex = currentClueIndex + 1;
      const nextClue = currentClues[newIndex];
      setCurrentClueIndex(newIndex);
      setSelectedCell({ row: nextClue.startRow, col: nextClue.startCol });
    }
  }, [currentClueIndex, currentClues]);

  const goToPreviousClue = useCallback(() => {
    if (currentClueIndex > 0) {
      const newIndex = currentClueIndex - 1;
      const prevClue = currentClues[newIndex];
      setCurrentClueIndex(newIndex);
      setSelectedCell({ row: prevClue.startRow, col: prevClue.startCol });
    }
  }, [currentClueIndex, currentClues]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (crossword?.grid[row][col] === '█') return;
    
    // Find which clue this cell belongs to in current direction
    const clues = currentDirection === 'across' ? crossword.clues.across : crossword.clues.down;
    const clueIndex = clues.findIndex(clue => {
      if (currentDirection === 'across') {
        return clue.startRow === row && col >= clue.startCol && col < clue.startCol + clue.length;
      } else {
        return clue.startCol === col && row >= clue.startRow && row < clue.startRow + clue.length;
      }
    });
    
    if (clueIndex !== -1) {
      setCurrentClueIndex(clueIndex);
    }
    
    setSelectedCell({ row, col });
  }, [crossword, currentDirection]);

  if (!crossword) {
    return <div className="flex justify-center items-center min-h-96">
      <div className="text-lg">Loading crossword...</div>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Difficulty Selector */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-purple-600 mb-2">Theatre Spotlight</h1>
        <div className="flex items-center gap-4 mb-2">
          <div className="text-lg font-semibold">Difficulty:</div>
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard', 'expert'] as const).map(level => (
              <Button
                key={level}
                variant={difficulty === level ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty(level)}
                className="capitalize"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Click on a cell to start typing. Use spacebar to change direction on mobile.
        </div>
      </div>

      {/* Timer and Controls */}
      <div className="flex items-center justify-between mb-6 p-3 bg-gray-100 rounded-lg shadow-sm">
        <div className="flex items-center">
          <Clock className="w-6 h-6 mr-3 text-gray-600" />
          <span className="text-3xl font-mono font-bold text-gray-800">{elapsedTime}</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={showSolution ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2"
            disabled={!solutionAvailability?.available}
            title={solutionAvailability?.available ? "Toggle solution" : solutionAvailability?.message}
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {solutionAvailability?.available ? 
              (showSolution ? "Hide Solution" : "Show Solution") : 
              "Solution Tomorrow 5AM"
            }
          </Button>
          {showTicketCTAs && completedShows.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTicketCTAs(false)}
              className="text-xs"
            >
              Hide CTAs
            </Button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="mb-6 flex justify-center overflow-x-auto px-4">
        <div className="inline-grid gap-[1px] bg-gray-400 p-1 rounded shadow-lg" style={{gridTemplateColumns: 'repeat(15, 1fr)', maxWidth: '90vw', width: 'min(450px, 90vw)'}}>
          {crossword.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellKey = `${rowIndex}-${colIndex}`;
              const isHighlighted = highlightedCells.has(cellKey);
              const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
              const userValue = userAnswers[cellKey] || '';
              const solutionValue = showSolution && crossword.solution ? crossword.solution[rowIndex][colIndex] : '';
              
              // Find clue number for this cell
              let clueNumber = '';
              let isCompletedShow = false;
              if (cell !== '█' && cell !== ' ') {
                const allClues = [...(crossword.clues.across || []), ...(crossword.clues.down || [])];
                const clue = allClues.find(c => c.startRow === rowIndex && c.startCol === colIndex);
                if (clue) {
                  clueNumber = clue.number.toString();
                  isCompletedShow = completedShows.some(s => s.number === clue.number);
                }
              }

              return (
                <div
                  key={cellKey}
                  className={`
                    aspect-square border-0 flex items-center justify-center text-sm font-bold relative cursor-pointer
                    ${cell === '█' ? 'bg-black' : 'bg-white'}
                    ${isHighlighted && cell !== '█' ? 'bg-blue-200 border-2 border-blue-400' : ''}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    ${isCompletedShow ? 'bg-green-100 border-2 border-green-400' : ''}
                  `}
                  style={{
                    minWidth: 'calc(min(30px, 6vw))',
                    minHeight: 'calc(min(30px, 6vw))',
                    fontSize: 'min(14px, 3vw)'
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {clueNumber && (
                    <span className="absolute top-0 left-0 text-[9px] font-bold leading-none p-[2px] text-black">{clueNumber}</span>
                  )}
                  <span className={`font-bold text-center ${isCompletedShow ? 'text-green-600' : 'text-blue-600'}`}>
                    {showSolution ? solutionValue : userValue}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Mobile Interface */}
      <div className="md:hidden">
        {/* Current Clue Display with Navigation */}
        {currentClue && (
          <div className="mb-4 bg-purple-600 text-white p-4 rounded-lg flex items-center justify-between shadow-md">
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPreviousClue}
              disabled={currentClueIndex === 0}
              className="text-white hover:bg-purple-700 p-3 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            
            <div className="text-center flex-1 px-2">
              <div className="font-bold text-lg">
                {currentClue.number}-{currentDirection === 'across' ? 'A' : 'D'} {currentClue.clue}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="lg"
              onClick={goToNextClue}
              disabled={currentClueIndex === currentClues.length - 1}
              className="text-white hover:bg-purple-700 p-3 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        )}

        {/* Completed Shows CTAs */}
        {showTicketCTAs && completedShows.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm text-green-700 mb-2">Shows available for booking:</div>
            <div className="flex flex-wrap gap-2">
              {completedShows.map(show => (
                <Button
                  key={show.number}
                  size="sm"
                  variant="outline"
                  className="text-xs border-green-300 text-green-700 hover:bg-green-100"
                  onClick={() => window.open(`https://example.com/tickets/${show.answer.toLowerCase()}`, '_blank')}
                >
                  <TicketIcon className="w-3 h-3 mr-1" />
                  {show.answer}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Responsive Keyboard - Hidden on small screens when grid is visible */}
        <div className="bg-gray-200 p-2 rounded-lg shadow-md">
          <div className="grid grid-cols-10 gap-1 mb-2">
            {'QWERTYUIOP'.split('').map(letter => (
              <Button
                key={letter}
                variant="secondary"
                size="sm"
                onClick={() => onScreenKeyboardPress(letter)}
                className="aspect-square p-0 text-xs font-bold bg-white hover:bg-gray-100 border border-gray-300"
                style={{ minHeight: '32px', fontSize: '12px' }}
              >
                {letter}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 mb-2">
            {'ASDFGHJKL'.split('').map(letter => (
              <Button
                key={letter}
                variant="secondary"
                size="sm"
                onClick={() => onScreenKeyboardPress(letter)}
                className="aspect-square p-0 text-xs font-bold bg-white hover:bg-gray-100 border border-gray-300"
                style={{ minHeight: '32px', fontSize: '12px' }}
              >
                {letter}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1">
            {/* Grid icon - Toggle button: 3 squares down, 4 squares across, intersecting on cell 2 */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCurrentDirection(currentDirection === 'across' ? 'down' : 'across');
                setCurrentClueIndex(0);
              }}
              className="aspect-square p-0 text-xs bg-purple-400 hover:bg-purple-500 border border-purple-500 text-white relative"
              title={`Switch to ${currentDirection === 'across' ? 'Down' : 'Across'}`}
              style={{ minHeight: '32px' }}
            >
              <div className="relative w-3 h-3">
                {/* Custom grid icon showing 3 down, 4 across intersecting at cell 2 */}
                <div className="absolute inset-0">
                  <div className="w-full h-[1px] bg-white absolute top-1"></div>
                  <div className="w-full h-[1px] bg-white absolute top-2"></div>
                  <div className="w-[1px] h-full bg-white absolute left-1"></div>
                  <div className="w-[1px] h-full bg-white absolute left-2"></div>
                </div>
              </div>
            </Button>
            {'ZXCVBNM'.split('').map(letter => (
              <Button
                key={letter}
                variant="secondary"
                size="sm"
                onClick={() => onScreenKeyboardPress(letter)}
                className="aspect-square p-0 text-xs font-bold bg-white hover:bg-gray-100 border border-gray-300"
                style={{ minHeight: '32px', fontSize: '12px' }}
              >
                {letter}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onScreenKeyboardPress('BACKSPACE')}
              className="aspect-square p-0 text-xs bg-gray-400 hover:bg-gray-500 border border-gray-500 text-white"
              title="Delete"
              style={{ minHeight: '32px' }}
            >
              ×
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}