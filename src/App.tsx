/* eslint-disable react-hooks/exhaustive-deps */
import { Preload } from '@react-three/drei';
import { VRM } from '@pixiv/three-vrm';
import { useRef, lazy, Suspense, useState, useLayoutEffect } from 'react';
import { useSceneState } from './hookstate-store/SceneState';
import { checkUserDeviceType } from './utils/general/devices';
import useHookstateGetters from './interfaces/Hookstate_Interface';
import UIElements from './components/ui/UIElements';
import Mocap from './components/Mocap';
import CameraAnimations from './components/CameraAnimations';
import GameLogic from './ecs/systems/GameLogic';
import { Physics } from '@react-three/cannon';
import AvatarHandColliders from './components/physics/AvatarHandColliders';
import { Bubbles } from './ecs/entities/Bubbles';


// THINGS TO NOTE FOR NEXT TIME - We can follow these performance tips to re-design the next game
// https://r3f.docs.pmnd.rs/advanced/pitfalls

import './css/App.css';

const Renderer = lazy(() => import('./canvas/Renderer'));
const Environment = lazy(() => import('./components/environment/Environment'));
const Avatar = lazy(() => import('./components/Avatar'));

export default function App() {
  const {
    avatarSelected,
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameOver,
    getSettingsReady
  } = useHookstateGetters();
  const sceneState = useSceneState();
  sceneState.device.set(checkUserDeviceType());

  const [holisticLoaded, setHolisticLoaded] = useState(false);
  const avatar = useRef<VRM | null>(null);

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  useLayoutEffect(() => {
    if (avatar.current && holisticLoaded && environmentLoaded()) {
      sceneState.sceneLoaded.set(true);
    }
  }, [holisticLoaded, environmentLoaded]);

  return (
    <>
      <UIElements avatar={avatar} />
      {environmentLoaded() && !gameOver() &&
        <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />
      }

      <Suspense fallback={null}>
        <Renderer>
          {environmentSelected() && <Environment selected={environmentSelected()}/>}
          {getSettingsReady() &&
            <Avatar
              setAvatarModel={setAvatarModel}
              avatar={avatar}
              avatarSelected={avatarSelected()}
            />
          }
          <CameraAnimations />
          {sceneLoaded() && !gameOver() && (
            <>
              <Physics gravity={[0, 0, 0]}>
                <AvatarHandColliders avatar={avatar} />
                <Bubbles />
              </Physics>
              <GameLogic avatar={avatar} />
            </>
          )}
          <Preload all />
        </Renderer>
      </Suspense>
    </>
  );
}
