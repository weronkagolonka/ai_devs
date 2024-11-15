export const compressRobotDescriptionSystemPrompt = `
You will receieve a description of a robot.
Your task is to shorten the description to make it more understandable to DALL-E 3 model.

<rules>
- focus on key characteristics of the robot, such as its appearance, equipment etc.
- use keywords to describe the robot's features rather than full sentences
</rules>
`