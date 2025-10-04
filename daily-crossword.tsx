import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Trophy, Lightbulb, RotateCcw, ExternalLink, Ticket, SkipForward, Eye, Grid3X3, ArrowRight, ArrowDown, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Link } from "wouter";

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
  title: string;
  grid: string[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

interface SavedAnswers {
  date: string;
  answers: string[][];
  completedClues: number[];
  completedAt?: string;
}

export default function DailyCrossword() {
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [completedClues, setCompletedClues] = useState<Set<number>>(new Set());
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentDirection, setCurrentDirection] = useState<'across' | 'down'>('across');
  const [highlightedShow, setHighlightedShow] = useState<string | null>(null);
  const [showTicketCTA, setShowTicketCTA] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [solutionAvailable, setSolutionAvailable] = useState(false);
  const [solutionMessage, setSolutionMessage] = useState('');
  const [currentClue, setCurrentClue] = useState<CrosswordClue | null>(null);
  const [hintsUsed, setHintsUsed] = useState<Set<number>>(new Set());
  const [showKeyboard, setShowKeyboard] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: crossword, isLoading, refetch } = useQuery<CrosswordPuzzle>({
    queryKey: ["/api/crossword/today", difficulty],
    refetchInterval: false,
  });

  const { data: solutionData } = useQuery({
    queryKey: ['/api/crossword/solution-available'],
    retry: false,
  });

  // Save answers mutation
  const saveAnswersMutation = useMutation({
    mutationFn: async (data: SavedAnswers) => {
      const response = await fetch('/api/crossword/save-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to save answers');
      return response.json();
    }
  });

  // Load saved answers
  const { data: savedAnswers } = useQuery<SavedAnswers>({
    queryKey: ["/api/crossword/answers", selectedDate],
    enabled: !!crossword,
  });

  // Initialize user grid when crossword loads or saved answers change
  useEffect(() => {
    if (crossword) {
      if (savedAnswers?.answers) {
        setUserGrid(savedAnswers.answers);
        setCompletedClues(new Set(savedAnswers.completedClues));
      } else {
        const initialGrid = crossword.grid.map(row => 
          row.map(cell => cell === '#' ? '#' : '')
        );
        setUserGrid(initialGrid);
        setCompletedClues(new Set());
      }
    }
  }, [crossword, savedAnswers]);

  useEffect(() => {
    if (solutionData) {
      setSolutionAvailable(solutionData.available);
      setSolutionMessage(solutionData.message);
    }
  }, [solutionData]);

  const handleCellInput = useCallback((row: number, col: number, value: string) => {
    if (!crossword || crossword.grid[row][col] === '#') return;
    
    const newGrid = [...userGrid];
    newGrid[row][col] = value.toUpperCase();
    setUserGrid(newGrid);
    
    // Auto-advance to next cell
    if (value && value.trim() !== '') {
      autoAdvanceToNextCell(row, col, newGrid);
    }
    
    // Check if any clues are completed
    const newCompletedClues = checkCompletedClues(newGrid);
    
    // Auto-save progress
    const saveData: SavedAnswers = {
      date: selectedDate,
      answers: newGrid,
      completedClues: Array.from(newCompletedClues),
      completedAt: newCompletedClues.size === (crossword.clues.across.length + crossword.clues.down.length) ? new Date().toISOString() : undefined
    };
    
    saveAnswersMutation.mutate(saveData);
  }, [crossword, userGrid, selectedDate, saveAnswersMutation]);

  const autoAdvanceToNextCell = useCallback((currentRow: number, currentCol: number, grid: string[][]) => {
    if (!crossword) return;

    // Find the current word being filled
    const currentClue = getCurrentClue(currentRow, currentCol);
    if (!currentClue) return;

    let nextRow = currentRow;
    let nextCol = currentCol;

    if (currentClue.direction === 'across') {
      nextCol += 1;
      // Check if we've reached the end of the word
      if (nextCol >= currentClue.startCol + currentClue.length) {
        return; // Stop at word end
      }
    } else {
      nextRow += 1;
      // Check if we've reached the end of the word
      if (nextRow >= currentClue.startRow + currentClue.length) {
        return; // Stop at word end
      }
    }

    // Ensure we stay within grid bounds and on valid cells
    if (nextRow >= 0 && nextRow < crossword.grid.length && 
        nextCol >= 0 && nextCol < crossword.grid[0].length && 
        crossword.grid[nextRow][nextCol] !== '#') {
      
      // Skip if cell already filled, continue to next
      if (grid[nextRow][nextCol] && grid[nextRow][nextCol] !== ' ') {
        autoAdvanceToNextCell(nextRow, nextCol, grid);
        return;
      }
      
      setSelectedCell({ row: nextRow, col: nextCol });
      
      // Focus the next input
      setTimeout(() => {
        const nextInput = document.querySelector(`input[data-row="${nextRow}"][data-col="${nextCol}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }, 10);
    }
  }, [crossword]);

  const getCurrentClue = useCallback((row: number, col: number) => {
    if (!crossword) return null;

    // Find which clue this cell belongs to based on current direction
    const relevantClues = currentDirection === 'across' ? crossword.clues.across : crossword.clues.down;
    
    const clue = relevantClues.find(clue => {
      if (clue.direction === 'across') {
        return row === clue.startRow && col >= clue.startCol && col < clue.startCol + clue.length;
      } else {
        return col === clue.startCol && row >= clue.startRow && row < clue.startRow + clue.length;
      }
    });
    
    if (clue && clue !== currentClue) {
      setCurrentClue(clue);
    }
    
    return clue;
  }, [crossword, currentDirection, currentClue]);

  const checkCompletedClues = useCallback((grid: string[][]) => {
    if (!crossword) return new Set<number>();
    
    const completed = new Set<number>();
    const showAnswers = new Set<string>();
    
    const allClues = [...crossword.clues.across, ...crossword.clues.down];
    allClues.forEach(clue => {
      let isComplete = true;
      const expectedAnswer = clue.answer.toUpperCase();
      
      for (let i = 0; i < clue.length; i++) {
        const row = clue.direction === 'across' ? clue.startRow : clue.startRow + i;
        const col = clue.direction === 'across' ? clue.startCol + i : clue.startCol;
        
        if (grid[row]?.[col] !== expectedAnswer[i]) {
          isComplete = false;
          break;
        }
      }
      
      if (isComplete) {
        completed.add(clue.number);
        // Check if this is a show name
        if (isTheatreShow(expectedAnswer)) {
          showAnswers.add(expectedAnswer);
        }
      }
    });
    
    setCompletedClues(completed);
    
    // Update show highlighting
    if (showAnswers.size > 0) {
      const firstShow = Array.from(showAnswers)[0];
      setHighlightedShow(firstShow);
      setShowTicketCTA(true);
    }
    
    return completed;
  }, [crossword]);

  const moveToNextCell = (currentRow: number, currentCol: number) => {
    if (!crossword) return;
    
    // Find next non-black cell in current direction
    let nextRow = currentRow;
    let nextCol = currentCol;
    
    if (currentDirection === 'across') {
      nextCol++;
      // Skip black squares in the same row
      while (nextCol < crossword.size && (crossword.grid[nextRow][nextCol] === '#' || !crossword.grid[nextRow][nextCol])) {
        nextCol++;
      }
      // If we've reached the end of the row, find next available cell
      if (nextCol >= crossword.size) {
        // Search for next non-black cell in the entire grid
        let found = false;
        for (let r = currentRow; r < crossword.size && !found; r++) {
          for (let c = (r === currentRow ? currentCol + 1 : 0); c < crossword.size && !found; c++) {
            if (crossword.grid[r][c] !== '#') {
              nextRow = r;
              nextCol = c;
              found = true;
            }
          }
        }
        if (!found) {
          // Wrap around to beginning
          for (let r = 0; r <= currentRow && !found; r++) {
            for (let c = 0; c < (r === currentRow ? currentCol : crossword.size) && !found; c++) {
              if (crossword.grid[r][c] !== '#') {
                nextRow = r;
                nextCol = c;
                found = true;
              }
            }
          }
        }
      }
    } else {
      nextRow++;
      // Skip black squares in the same column
      while (nextRow < crossword.grid.length && (crossword.grid[nextRow][nextCol] === '#' || !crossword.grid[nextRow][nextCol])) {
        nextRow++;
      }
      // If we've reached the end of the column, find next available cell
      if (nextRow >= crossword.grid.length) {
        // Search for next non-black cell in the entire grid
        let found = false;
        for (let c = currentCol; c < crossword.grid.length && !found; c++) {
          for (let r = (c === currentCol ? currentRow + 1 : 0); r < crossword.grid.length && !found; r++) {
            if (crossword.grid[r][c] !== '#') {
              nextRow = r;
              nextCol = c;
              found = true;
            }
          }
        }
        if (!found) {
          // Wrap around to beginning
          for (let c = 0; c <= currentCol && !found; c++) {
            for (let r = 0; r < (c === currentCol ? currentRow : crossword.grid.length) && !found; r++) {
              if (crossword.grid[r][c] !== '#') {
                nextRow = r;
                nextCol = c;
                found = true;
              }
            }
          }
        }
      }
    }
    
    // Set focus to the next cell if valid
    if (nextRow < crossword.size && nextCol < crossword.size && crossword.grid[nextRow][nextCol] !== '#' && crossword.grid[nextRow][nextCol]) {
      setSelectedCell({ row: nextRow, col: nextCol });
    }
  };

  const isTheatreShow = (answer: string): boolean => {
    const shows = ['HAMILTON', 'CATS', 'WICKED', 'CHICAGO', 'PHANTOM', 'MATILDA', 'ANNIE', 'RENT', 'GREASE', 'HAIRSPRAY'];
    return shows.includes(answer.toUpperCase());
  };

  const resetPuzzle = () => {
    if (crossword) {
      const initialGrid = crossword.grid.map(row => 
        row.map(cell => cell === '#' ? '#' : '')
      );
      setUserGrid(initialGrid);
      setCompletedClues(new Set());
      setShowSolution(false);
      setHighlightedShow(null);
      setShowTicketCTA(false);
      
      // Save reset state
      const saveData: SavedAnswers = {
        date: selectedDate,
        answers: initialGrid,
        completedClues: []
      };
      saveAnswersMutation.mutate(saveData);
    }
  };

  const toggleSolution = () => {
    if (solutionAvailable) {
      setShowSolution(!showSolution);
    } else {
      alert(solutionMessage || 'Solution not available yet. Check back after 5:00 AM UK time tomorrow.');
    }
  };

  const giveHint = () => {
    if (!currentClue || hintsUsed.has(currentClue.number)) return;
    
    // Find the first empty cell in the current clue
    let hintGiven = false;
    for (let i = 0; i < currentClue.length; i++) {
      const row = currentClue.direction === 'across' ? currentClue.startRow : currentClue.startRow + i;
      const col = currentClue.direction === 'across' ? currentClue.startCol + i : currentClue.startCol;
      
      if (!userGrid[row] || !userGrid[row][col] || userGrid[row][col] === '') {
        const newGrid = [...userGrid];
        newGrid[row][col] = currentClue.answer[i].toUpperCase();
        setUserGrid(newGrid);
        setHintsUsed(prev => new Set([...prev, currentClue.number]));
        hintGiven = true;
        break;
      }
    }
    
    if (!hintGiven) {
      alert('This clue is already complete or no hint available!');
    }
  };

  const skipToNextClue = () => {
    if (!crossword) return;
    
    const allClues = [...crossword.clues.across, ...crossword.clues.down];
    const currentIndex = currentClue ? allClues.findIndex(c => c.number === currentClue.number && c.direction === currentClue.direction) : -1;
    const nextIndex = (currentIndex + 1) % allClues.length;
    const nextClue = allClues[nextIndex];
    
    if (nextClue) {
      setCurrentClue(nextClue);
      setSelectedCell({ row: nextClue.startRow, col: nextClue.startCol });
      setCurrentDirection(nextClue.direction);
    }
  };

  const onScreenKeyboardPress = (letter: string) => {
    if (!selectedCell || !crossword) return;
    
    if (letter === 'BACKSPACE') {
      handleCellInput(selectedCell.row, selectedCell.col, '');
    } else if (letter === 'CLEAR') {
      if (currentClue) {
        const newGrid = [...userGrid];
        for (let i = 0; i < currentClue.length; i++) {
          const row = currentClue.direction === 'across' ? currentClue.startRow : currentClue.startRow + i;
          const col = currentClue.direction === 'across' ? currentClue.startCol + i : currentClue.startCol;
          newGrid[row][col] = '';
        }
        setUserGrid(newGrid);
      }
    } else {
      handleCellInput(selectedCell.row, selectedCell.col, letter);
      moveToNextCell(selectedCell.row, selectedCell.col);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPuzzleProgress = () => {
    if (!crossword) return 0;
    const totalClues = crossword.clues.across.length + crossword.clues.down.length;
    return Math.round((completedClues.size / totalClues) * 100);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500">Loading today's theatre crossword...</div>
        </div>
      </div>
    );
  }

  if (!crossword) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">Unable to load crossword puzzle</div>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Daily Theatre Crossword | Test Your Show Knowledge
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          Challenge yourself with our daily theatre crossword featuring Broadway shows, West End productions, 
          performers, and theatre terminology. New puzzle every day!
        </p>
        
        {/* Puzzle Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(crossword.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <Badge className={getDifficultyColor(difficulty)}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
          {crossword.theme && (
            <Badge variant="outline">
              Theme: {crossword.theme}
            </Badge>
          )}
          <div className="flex items-center text-gray-600">
            <Trophy className="w-4 h-4 mr-1" />
            Progress: {completedClues.size}/{crossword.clues.across.length + crossword.clues.down.length} clues ({getPuzzleProgress()}%) | {crossword.clues.across.length} across, {crossword.clues.down.length} down
          </div>
        </div>
      </div>

      {/* Value Proposition Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">15+ Years of Unique Theatre Crosswords</h2>
            <p className="text-purple-100">
              Over 1,000 theatre answers covering Broadway, West End, performers, and industry knowledge
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{completedClues.size}/{crossword.clues.length}</div>
            <div className="text-sm text-purple-200">Clues completed</div>
            <div className="text-xs text-purple-300 mt-1">
              Progress saves for 30 days when signed in, 1 day when anonymous
            </div>
          </div>
        </div>
      </div>

      {/* Show Highlight & Ticket CTA */}
      {showTicketCTA && highlightedShow && (
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-green-800 mb-2">
                  🎭 Great job! You solved "{highlightedShow}"
                </h3>
                <p className="text-green-700">
                  Want to see this show? Check current availability and book tickets now.
                </p>
              </div>
              <div className="flex space-x-3">
                <Link href={`/whats-on?search=${highlightedShow.toLowerCase()}`}>
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Ticket className="w-4 h-4 mr-2" />
                    Get Tickets
                  </Button>
                </Link>
                <Button variant="outline" className="border-green-300 text-green-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Show Info
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Clue Display */}
      {currentClue && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1">
                    <Grid3X3 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-600 uppercase">
                      {currentClue.direction}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {currentClue.number}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {currentClue.length} letters
                  </Badge>
                  {hintsUsed.has(currentClue.number) && (
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                      Hint Used
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-blue-800">
                  {currentClue.clue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        {/* Crossword Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{crossword.title}</CardTitle>
                <CardDescription>
                  Click on a cell to start typing. Use spacebar to change direction on mobile.
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={resetPuzzle}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={skipToNextClue}>
                  <SkipForward className="w-4 h-4 mr-1" />
                  Skip
                </Button>
                {(difficulty === 'easy' || difficulty === 'medium') && currentClue && !hintsUsed.has(currentClue.number) && (
                  <Button variant="outline" size="sm" onClick={giveHint}>
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Free Letter
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleSolution}
                  disabled={!solutionAvailable && !showSolution}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  {showSolution ? 'Hide Solution' : solutionAvailable ? 'Show Solution' : 'Check back tomorrow'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Mobile direction controls */}
              <div className="mb-4 md:hidden">
                <div className="text-center text-sm text-gray-600 mb-2">
                  Current direction: {currentDirection === 'across' ? 'Across →' : 'Down ↓'}
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button
                    onClick={() => setCurrentDirection('across')}
                    variant={currentDirection === 'across' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <div className="w-4 h-4 relative mr-2">
                      <div className="absolute inset-0 grid grid-cols-4 grid-rows-3 gap-px">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                      </div>
                    </div>
                    Across
                  </Button>
                  <Button
                    onClick={() => setCurrentDirection('down')}
                    variant={currentDirection === 'down' ? 'default' : 'outline'}
                    size="sm"
                  >
                    <div className="w-4 h-4 relative mr-2">
                      <div className="absolute inset-0 grid grid-rows-4 grid-cols-3 gap-px">
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-current rounded-sm"></div>
                        <div className="bg-transparent"></div>
                        <div className="bg-transparent"></div>
                      </div>
                    </div>
                    Down
                  </Button>
                </div>
                
                {/* Difficulty Level Controls */}
                <div className="text-center text-sm text-gray-600 mb-2">
                  Difficulty Level
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setDifficulty('easy')}
                    variant={difficulty === 'easy' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Easy
                  </Button>
                  <Button
                    onClick={() => setDifficulty('medium')}
                    variant={difficulty === 'medium' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Medium
                  </Button>
                  <Button
                    onClick={() => setDifficulty('hard')}
                    variant={difficulty === 'hard' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Hard
                  </Button>
                  <Button
                    onClick={() => setDifficulty('dedicated')}
                    variant={difficulty === 'dedicated' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Dedicated
                  </Button>
                </div>
              </div>

              {/* Crossword Grid - Fixed Display */}
              <div className="relative max-w-2xl mx-auto">
                <div 
                  className="grid border-2 border-black bg-black"
                  style={{ 
                    gridTemplateColumns: 'repeat(15, 32px)',
                    gridTemplateRows: 'repeat(15, 32px)',
                    gap: '1px'
                  }}
                >
                  {crossword.grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      const isBlack = cell === '█';
                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                      const displayValue = showSolution ? 
                        (isBlack ? '' : cell) : 
                        (userGrid[rowIndex]?.[colIndex] || '');
                      
                      // Find clue number for this cell
                      const allClues = [...crossword.clues.across, ...crossword.clues.down];
                      const clueNumber = allClues.find(clue => 
                        clue.startRow === rowIndex && clue.startCol === colIndex
                      )?.number;

                      if (isBlack) {
                        return (
                          <div
                            key={`cell-${rowIndex}-${colIndex}`}
                            className="w-8 h-8 bg-black"
                          />
                        );
                      }

                      return (
                        <div
                          key={`cell-${rowIndex}-${colIndex}`}
                          className={`
                            relative w-8 h-8 flex items-center justify-center border border-gray-400
                            ${isSelected
                              ? 'bg-yellow-200'
                              : 'bg-white cursor-pointer hover:bg-blue-50'
                            }
                          `}
                          onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                        >
                          {clueNumber && (
                            <span 
                              className="absolute top-0 left-0 text-[10px] font-bold text-black leading-none z-10"
                              style={{ padding: '1px' }}
                            >
                              {clueNumber}
                            </span>
                          )}
                          <input
                            ref={(el) => {
                              if (el && isSelected) {
                                requestAnimationFrame(() => {
                                  if (document.activeElement !== el) {
                                    el.focus();
                                    el.setSelectionRange(el.value.length, el.value.length);
                                  }
                                });
                              }
                            }}
                            type="text"
                            className="absolute inset-0 border-0 bg-transparent text-center font-bold outline-none uppercase text-sm"
                            style={{ paddingTop: clueNumber ? '8px' : '0' }}
                            value={displayValue}
                            maxLength={1}
                            onChange={(e) => {
                              if (!showSolution) {
                                const value = e.target.value.slice(-1).toUpperCase();
                                handleCellInput(rowIndex, colIndex, value);
                                if (value && /[A-Z]/.test(value)) {
                                  requestAnimationFrame(() => {
                                    moveToNextCell(rowIndex, colIndex);
                                  });
                                }
                              }
                            }}
                            onFocus={() => {
                              setSelectedCell({ row: rowIndex, col: colIndex });
                              const clue = getCurrentClue(rowIndex, colIndex);
                              if (clue) setCurrentClue(clue);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace') {
                                handleCellInput(rowIndex, colIndex, '');
                              } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                                e.preventDefault();
                                setCurrentDirection('across');
                                moveToNextCell(rowIndex, colIndex);
                              } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                                e.preventDefault();
                                setCurrentDirection('down');
                                autoAdvanceToNextCell(rowIndex, colIndex, userGrid);
                              } else if (e.key === ' ') {
                                e.preventDefault();
                                setCurrentDirection(currentDirection === 'across' ? 'down' : 'across');
                              } else if (e.key === 'Tab') {
                                e.preventDefault();
                                moveToNextCell(rowIndex, colIndex);
                              }
                            }}
                            disabled={showSolution}
                            readOnly={showSolution}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clues */}
        <div className="space-y-6">
          {/* Across Clues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Across</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {crossword.clues.across
                .map(clue => (
                  <div 
                    key={`across-clue-${clue.number}-${clue.startRow}-${clue.startCol}`}
                    className={`p-2 rounded text-sm ${
                      completedClues.has(clue.number) 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="font-bold text-purple-600">{clue.number}.</span>{' '}
                    <span className={completedClues.has(clue.number) ? 'line-through text-gray-500' : ''}>
                      {clue.clue}
                    </span>
                    {showSolution && (
                      <span className="ml-2 font-bold text-green-600">({clue.answer})</span>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Down Clues */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Down</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {crossword.clues.down
                .map(clue => (
                  <div 
                    key={`down-clue-${clue.number}-${clue.startRow}-${clue.startCol}`}
                    className={`p-2 rounded text-sm ${
                      completedClues.has(clue.number) 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <span className="font-bold text-purple-600">{clue.number}.</span>{' '}
                    <span className={completedClues.has(clue.number) ? 'line-through text-gray-500' : ''}>
                      {clue.clue}
                    </span>
                    {showSolution && (
                      <span className="ml-2 font-bold text-green-600">({clue.answer})</span>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Progress */}
          {getPuzzleProgress() === 100 && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-bold text-green-800">Congratulations!</h3>
                <p className="text-sm text-green-600 mb-3">You've completed today's crossword!</p>
                {savedAnswers?.completedAt && (
                  <p className="text-xs text-gray-500">
                    Completed on {new Date(savedAnswers.completedAt).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-bold text-blue-800 mb-2">How to Play</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Click a cell and type to enter letters</li>
                <li>• Press Tab to switch between across/down</li>
                <li>• Use "Free Letter" hint on Easy/Medium puzzles</li>
                <li>• Skip to next clue if you're stuck</li>
                <li>• Show names turn green when completed</li>
                <li>• Your progress saves automatically</li>
                <li>• Answers saved for 30 days</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Keyboard - Always Visible */}
      <div className="md:hidden mt-6">
        {/* Timer */}
        <div className="flex items-center justify-center mb-3 text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {completionTime || elapsedTime}
        </div>

        {/* Current Clue Display with Navigation */}
        {currentClue && (
          <div className="mb-4 bg-teal-400 text-white p-3 rounded flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousClue}
              disabled={currentClueIndex === 0}
              className="text-white hover:bg-teal-500"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center flex-1">
              <div className="font-semibold">
                {currentClue.number}-{currentDirection === 'across' ? 'A' : 'D'} {currentClue.clue}
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextClue}
              disabled={currentClueIndex === currentClues.length - 1}
              className="text-white hover:bg-teal-500"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
        
        {/* Keyboard */}
        <div className="bg-gray-200 p-3 rounded-lg">
          <div className="grid grid-cols-10 gap-1 mb-2">
            {'QWERTYUIOP'.split('').map(letter => (
              <Button
                key={letter}
                variant="secondary"
                size="sm"
                onClick={() => onScreenKeyboardPress(letter)}
                className="aspect-square p-0 text-xs bg-white"
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
                className="aspect-square p-0 text-xs bg-white"
              >
                {letter}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentDirection(currentDirection === 'across' ? 'down' : 'across')}
              className="aspect-square p-0 text-xs bg-gray-300"
            >
              <Grid3X3 className="w-3 h-3" />
            </Button>
            {'ZXCVBNM'.split('').map(letter => (
              <Button
                key={letter}
                variant="secondary"
                size="sm"
                onClick={() => onScreenKeyboardPress(letter)}
                className="aspect-square p-0 text-xs bg-white"
              >
                {letter}
              </Button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onScreenKeyboardPress('BACKSPACE')}
              className="aspect-square p-0 text-xs bg-gray-300"
            >
              ×
            </Button>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Previous Puzzles</CardTitle>
          <CardDescription>Try crosswords from other dates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-auto"
            />
            <Button onClick={() => refetch()}>
              Load Puzzle
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}