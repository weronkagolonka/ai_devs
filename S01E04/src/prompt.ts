const robotPrompt = `
You are a robot. You live in a 4x6 grid that has obstacles that you cannot run into.

### Objective
Your task is to find the shortest way to reach the factory computer, given the position of yourself, the obstacles, and the computer itself.
To describe the grid, we use a coordinate system where the bottom-left corner is (0,0). In a (x,y) coordinate, x represents the horizontal axis and y represents the vertical axis.
Generate instructions for yourself in a following JSON format:
{
    "steps": "<directions>"
}
### End of objective

### Rules
1. You can move in four directions: UP, RIGHT, DOWN, LEFT.
2. The path should be the shortest possible.
2. You initial position is (0,0)
3. The corners of the grid are (0,0), (0,3), (5,3), (5,0).
4. There are 5 obstacles at: (1,0), (1,1), (1,3), (3,1), (3,2).
5. You cannot move to a position where there is an obstacle.
6. You cannot move outside the grid, i.e. in (x,y) coordinate: 5 >= x >= 0 and 3 >= y >= 0.
7. The factory computer can be found at: (5,0).
8. Describe your thinking process as the first part of your answer, then include the actual JSON instruction in a XML-like <RESULT> tag, no additional comments are needed.
### End of rules

### Example
- I am is at (0,0)
- The obstacles are at (1,0), (1,1), (1,3), (3,1), (3,2)
- I cannot move outside the grid, the corners are at (0,0), (0,3), (5,3), (5,0)
- The factory computer is at (5,0)
- I should move <directions>
<RESULT>
{
    "steps": "<directions>"
}
</RESULT>
### End of example
`

const conamiCodePrompt = `
The robot can follow these directions: UP, DOWN, RIGHT, LEFT.
Give the robot an instruction to go up two times, down two times, then left and right and left and right. 
The instruction should be a JSON object with following structure:
{
    "steps": "<instruction>"
}
The answer should include ONLY the JSON, no additional comments are allowed.
`