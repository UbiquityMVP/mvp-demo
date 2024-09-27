# DUMMY DEMO BRANCH - Demo version of the MVP that submits no data

## Standing Range of Motion Version Log

### 3 Month Sprint & MVP Milestones
- 6/27/24 - 7/8/24:
  - The game logic flow was put on an ECS (an architectural pattern that allows for more performant creation and destruction of objects). Colliders were added to bubble targets in a physics system, and a new IK solution was prototyped for the mocap involving re-skinning the model in blender (creating a Mixamo instead of VRM) and setting up individual rotation and positional limits for each bone. This is difficult to do, as mocap data also has its own rotational and positional translations; the difficulty lies in matching these up and fine tuning limits to get a natural movement of the avatar.

- 7/8/24 - 7/22/24:
  - The game logic flow is more complete: given any number of bubble targets and sets, the game automatically spawns targets on various sides of the body, with colliders only on active bubbles to have players pop in a certain order. If the player takes too long to pop a target, it pops on its own and counts as a "miss", ending the player's current streak. For IK: the skinned mesh and data points got combined with the live mocap data points, so the avatar now responds to player movement from the video camera, but the IK still needs adjustments to set human limits to make it more natural.

- 7/22/24 - 8/5/24:
  - In order to integrate the UI and special effects into the game, it needs to be templated first to make sure elements trigger, change, and respond to various data and states within the game logic flow. After being templated, it is ready for the professional looking After Effects. IK continues to be refined - Potter has the solvers looking good with manual transform controls on the hand bone, but is still working on a solution for making the mocap video data map to the avatar as well as the transform control. Likely need to revisit world space transformations to properly map the data for hand movement. Rachel is exploring IK using the original model and using Potter's re-skinning strategy with code instead of within blender to see if we can get identical tranform control results and tackle mocap data together. Right now there are two potential models to use: one as a VRM and one as a Mixamo rig model. Using CCD algorithm (and any other IK algorithm, really) results in a perpetual arm swimming motion, and it's been a challenge to identify the source of this, be it pre-transformations, pre-rotations, or a hidden "roll" property baked into the model that Potter found when he brought it into blender.

- 8/5/24 - 8/16/24:
  - IP

## Pre-Sprint Exploration and Prototyping
Developing the proof of concept moving from IR to open source technologies and R3F. Created first environments to match the lookdev and setup base skeleton of the project:

### BLOCKERS from 5/22/24 - 6/10/24 impeded development
(result of not enough planning before coding and enforcing deadline expectations on an exploration phase)

```
- Physics
      -> As we've been developing the demo, we have been running into some limitations with the current physics system (Cannon). For example, Cannon did not supply an out-of-the-box method for accessing velocity properties on collision events (when the hand collides with a bubble, there was no way to peek inside as to what the hand's velocity was at the time of impact, it had to be calculated by hand). Another hurdle was trying to put a collider on the avatar's body such that the hands would be prevented from going inside the body. Cannon has limitations for this in that you can't add colliders after-the-fact (after a model has been loaded in the scene, like our avatar is). You can add colliders anywhere else in the scene including OVER the avatar model, but the mesh and material of the avatar hands won't behave like they have a collider on them because the colliders are a separate simulation that won't "pull" the hand along with it when it collides with something. We're currently exploring other solutions (one solution explored was setting dot product thresholds for the raw mocap data to reset arm position when the arm vectors got too close to the leg vectors, but it looked unnatural), and exploring other physics engines such as Rapier and Physx-js, but each have their own limitations as well. Right now it's a matter of reading, learning, and experimenting with the best long-term solution that will work for the demo and beyond.
```
```
- Mocap
       -> There are several ways to try and solve the mapping of video stream data to avatar bone movement, and one of the pathways explored was IK (inverse kinematics), which takes a target position (like the dynamic position of the hands) and goes along the kinetic chain of the arm in reverse to estimate proper movement of the entire limb. There are some IK solvers that exist for the technology we are using, which act very similar to the current method of: A) taking in live mocap data from the video stream, B) defining a chain of bones to represent the limb, C) __(middle step)___, and D) mapping the results of the middle step onto the avatar model. The middle step for IK *should* be as simple as feeding in the chain of bones to a solver and letting the black box technology do some magic before mapping to the avatar, but when attempted, the mocap video stream data needed to be pre-rotated and adjusted before doing so, which is what is currently being done in the Kalidokit-inspired solvers that we have now. And, at that point, after applying pre-rotations, it almost seemed unnecessary to use IK on top of the math that was already happening, so in order to improve the mocap further there are a couple branching pathways that I foresee: 1) Go back to the basics of the Kalidokit-inspired solvers and tweaking, which likely involves (at least for me personally) learning some more fundamentals of 3D vector and 4D quaternion math (maybe just dedicating a day to no code, just learning). And 2) Finding a proper way to implement the CCDIK THREE.js solver without needing pre-rotations, figuring out the proper way to create that setup by finding examples and reading more documentation or finding an example of another IK solver in the wild that we can use.
Update: attempted CCDIK solver with no pre-rotations and arm was perpetually spinning counterclockwise - need to understand why this is happening, as this is the same result when implementing the EE IK solver
```
```
- Performance Optimizations
       -> Potter has been working hard on optimizing the particles and environment we have now, and ran into a hurdle of the optimizations not being completely compatible with the project (optimizations worked in an isolated sandbox, but had difficulty merging/interacting with the whole project). Most of that has been figured out though, it's just a matter of finally merging! yay.
       -> There are still more performance optimizations that can be made to ease the load on certain browsers and devices such as optimizing our bundler, cleaning up project dependencies and splitting up the codebase, paying for a CDN provider to host our images, sounds, models, etc. (will make delivery faster if it comes from an actual CDN provider), etc.
```
```
- Incorporating the UI into the live demo link
      -> Currently the UI is separate/split from the repo we have been developing on, and will need to have features cherry picked, refactored, and revised to fit the current project structure.
```
```
- Prepping for a new Developer to join the team
     -> My goal is to clean up our repo to be as human readable, developer friendly, and uniform as possible, making sure our documentation of revisions is up to date, establish a Git Workflow standard for better collaboration, and also implementing some light devops so that code can't be merged into production unless it's been reviewed by a team member, tested, and abides by standard linting rules. This might involve a good week or so of polish and prep, and also might require purchasing a GitHub Teams account (unless UVX already has one) so that we can add branch protection rules for a private repo.
```

### Historical Milestones
- 5/23/24: Nathan Potter - Environment displacement and instancing. Created a new grass system for the outdoor environment
- 5/21/24: All - Big UVX Company Sync and Demo Day Event
- 5/20/24: Nazarii Kubik - Created an appealing UI/HUD for in-game elements within a JS/HTML sandbox prototype
- 5/19/24: Nazarii Kubik - Designed transitions, background animations, special effects, and bubble pop animations in Adobe After Effects
- 5/18/24: Nazarii Kubik - Designed the overall game interface and screen flow in Figma
- 5/17/24: Nathan Potter - Optimized outdoor environment load time, added background music to the outdoor scene.
- 5/15/24: Rachel Miller - Iterations on mocap with different solvers and approaches (see blockers)
- 5/14/24: Nathan Potter - Added cannon top level physics, particles, and pre-commit rules/linting
- 5/9/24: Nathan Potter - Added environment scene selection and outdoor scene with new Avatar
- 5/8/24: Nathan Potter - Created a new avatar model with a more symmetrical mesh.
- 5/7/24: Rachel Miller - Further improved arm motion capture, NCS bg music, loading screen fades out
- 5/3/24: Rachel Miller - Improved wrist tracking for motion capture and uvx branded landmark colors
- 5/2/24: Nathan Potter - Demo and Main now have preliminary mobile optimization/responsiveness. Added environment sound & video texture.
- 4/30/24: Rachel Miller - Demo performance optimizations for WebGL1 vs WebGL2, updated environment and slight wrist fix on avatar. Arm angles now track after the scene has loaded (starting around 18 deg instead of 90 T-pose).
- 4/29/24: Rachel Miller - Demo staged with webpack production bundle, Vite dev environment
- 4/25/24: Nathan Potter - Created first environment and avatar to match the UVX look dev
- 4/24/24: Nazarii Kubik - Created proof of concept for different avatar positions and game ideas in JS/HTML sandbox
- 4/15/24: Rachel Miller - Translated proof of concept into udated environment on React
- 4/12/24: Nazarii Kubik - Created proof of concept using open source technologies in JS/HTML sandbox
- 4/5/24: Nazarii Kubik - Investigated alternatives to IR Engine (Previously EE)
