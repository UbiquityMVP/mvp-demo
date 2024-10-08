/* eslint-disable @typescript-eslint/no-explicit-any */
import { VRM } from '../../interfaces/THREE_Interface';
import { Pose, Hand } from './solvers'
import { rigRotation } from './rigging/rigRotAndPos';

export const animateVRM = (
  vrm: React.RefObject<VRM>,
  results: any // Mediapipe Results type does not include the 3D coordinates (za) for some reason, so have to type as any
) => {
  if (!vrm.current) return;
  // Take the results from Holistic and animate character based on its Pose and Hand Keypoints.
  let riggedPose, riggedLeftHand, riggedRightHand;
  // Pose 3D Landmarks are with respect to the midpoint of the Hip distance in meters
  const pose3DLandmarks = results.za;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight, normalized
  // x and y lm coords are normalized between 0.0 and 1.0 by image width (x) and height (y)
  // z is the lm depth, with depth at the midpoint of the hips as origin. The smaller the value, the
  // closer the lm is to the camera. The magnitude of z uses the same scale as x.
  const pose2DLandmarks = results.poseLandmarks;

  // need to be flipped b/c video stream is mirrored
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  // Animate Pose
  if (pose2DLandmarks && pose3DLandmarks) {
    riggedPose = Pose.solve(
      pose3DLandmarks,
      pose2DLandmarks,
      { enableLegs: true }
    );

    if (!riggedPose) return;

    // free motion tilting:
    // rigRotation(vrm, 'hips', riggedPose!.Hips.rotation, 0.7);

    // rigPosition(
    //   vrm,
    //   'hips',
    //   {
    //     x: -riggedPose!.Hips.position.x, // Reverse direction
    //     y: riggedPose!.Hips.position.y + 1, // Add a bit of height
    //     z: -riggedPose!.Hips.position.z // Reverse direction
    //   },
    //   1,
    //   0.07
    // );

    rigRotation(vrm, 'chest', riggedPose.Spine, 0.25, .3);
    rigRotation(vrm, 'spine', riggedPose.Spine, 0.45, .3);

    rigRotation(vrm, 'rightUpperArm', riggedPose.RightUpperArm, 1, .3);
    rigRotation(vrm, 'rightLowerArm', riggedPose.RightLowerArm, 1, .5);
    rigRotation(vrm, 'leftUpperArm', riggedPose.LeftUpperArm, 1, .3);
    rigRotation(vrm, 'leftLowerArm', riggedPose.LeftLowerArm, 1, .5);

    // comment out to lock the legs:
    // rigRotation(vrm, 'leftUpperLeg', riggedPose!.LeftUpperLeg, 1, .3);
    // rigRotation(vrm, 'leftLowerLeg', riggedPose!.LeftLowerLeg, 1, .3);
    // rigRotation(vrm, 'rightUpperLeg', riggedPose!.RightUpperLeg, 1, .3);
    // rigRotation(vrm, 'rightLowerLeg', riggedPose!.RightLowerLeg, 1, .3);
  }

  // Animate Hands
  if (leftHandLandmarks) {
    riggedLeftHand = Hand.solve(leftHandLandmarks, 'Left');
    rigRotation(vrm, 'leftHand', {
      // Combine pose rotation Z and hand rotation X Y
      z: riggedPose!.LeftHand.z,
      y: riggedLeftHand!.LeftWrist.y,
      x: riggedLeftHand!.LeftWrist.x
    }, 0.75, 0.4);
    rigRotation(vrm, 'leftRingProximal', riggedLeftHand!.LeftRingProximal);
    rigRotation(vrm, 'leftRingIntermediate', riggedLeftHand!.LeftRingIntermediate);
    rigRotation(vrm, 'leftRingDistal', riggedLeftHand!.LeftRingDistal);
    rigRotation(vrm, 'leftIndexProximal', riggedLeftHand!.LeftIndexProximal);
    rigRotation(vrm, 'leftIndexIntermediate', riggedLeftHand!.LeftIndexIntermediate);
    rigRotation(vrm, 'leftIndexDistal', riggedLeftHand!.LeftIndexDistal);
    rigRotation(vrm, 'leftMiddleProximal', riggedLeftHand!.LeftMiddleProximal);
    rigRotation(vrm, 'leftMiddleIntermediate', riggedLeftHand!.LeftMiddleIntermediate);
    rigRotation(vrm, 'leftMiddleDistal', riggedLeftHand!.LeftMiddleDistal);
    rigRotation(vrm, 'leftThumbProximal', riggedLeftHand!.LeftThumbProximal);
    rigRotation(vrm, 'leftThumbIntermediate', riggedLeftHand!.LeftThumbIntermediate);
    rigRotation(vrm, 'leftThumbDistal', riggedLeftHand!.LeftThumbDistal);
    rigRotation(vrm, 'leftLittleProximal', riggedLeftHand!.LeftLittleProximal);
    rigRotation(vrm, 'leftLittleIntermediate', riggedLeftHand!.LeftLittleIntermediate);
    rigRotation(vrm, 'leftLittleDistal', riggedLeftHand!.LeftLittleDistal);
  }
  if (rightHandLandmarks) {
    riggedRightHand = Hand.solve(rightHandLandmarks, 'Right');
    rigRotation(vrm, 'rightHand', {
      // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
      z: riggedPose!.RightHand.z,
      y: riggedRightHand!.RightWrist.y,
      x: riggedRightHand!.RightWrist.x
    }, 0.75, 0.4);
    rigRotation(vrm, 'rightRingProximal', riggedRightHand!.RightRingProximal);
    rigRotation(vrm, 'rightRingIntermediate', riggedRightHand!.RightRingIntermediate);
    rigRotation(vrm, 'rightRingDistal', riggedRightHand!.RightRingDistal);
    rigRotation(vrm, 'rightIndexProximal', riggedRightHand!.RightIndexProximal);
    rigRotation(vrm, 'rightIndexIntermediate',riggedRightHand!.RightIndexIntermediate);
    rigRotation(vrm, 'rightIndexDistal', riggedRightHand!.RightIndexDistal);
    rigRotation(vrm, 'rightMiddleProximal', riggedRightHand!.RightMiddleProximal);
    rigRotation(vrm, 'rightMiddleIntermediate', riggedRightHand!.RightMiddleIntermediate);
    rigRotation(vrm, 'rightMiddleDistal', riggedRightHand!.RightMiddleDistal);
    rigRotation(vrm, 'rightThumbProximal', riggedRightHand!.RightThumbProximal);
    rigRotation(vrm, 'rightThumbIntermediate', riggedRightHand!.RightThumbIntermediate);
    rigRotation(vrm, 'rightThumbDistal', riggedRightHand!.RightThumbDistal);
    rigRotation(vrm, 'rightLittleProximal', riggedRightHand!.RightLittleProximal);
    rigRotation(vrm, 'rightLittleIntermediate', riggedRightHand!.RightLittleIntermediate);
    rigRotation(vrm, 'rightLittleDistal', riggedRightHand!.RightLittleDistal);
  }
};
