import Image from "next/image"
import { rgba } from "polished"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import { useContext, useEffect, useRef, useState } from "react"
import styled, { css, ThemeContext } from "styled-components"
import { usePlayer } from "../contexts/PlayerContext"
import { convertDurationToTimeString } from "../utils/convertDurationToTimeString"

export const Player = () => {
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    playNext,
    playPrevious,
    setPlayingState,
    clearPlayerState,
  } = usePlayer()

  const theme = useContext(ThemeContext)

  const handleAudioTimeChange = (amount: number) => {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  const handleEpisodeEnded = () => {
    if (hasNext) {
      playNext()
    } else {
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  const audioRef = useRef<HTMLAudioElement>(null)

  const [progress, setProgress] = useState(0)

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener("timeupdate", () =>
      setProgress(Math.floor(audioRef.current.currentTime))
    )
  }

  useEffect(() => {
    if (!audioRef.current) {
      return
    }
    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  return (
    <PlayerContainer>
      <Header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </Header>

      {episode ? (
        <CurrentEpisode>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            alt=""
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </CurrentEpisode>
      ) : (
        <EmptyPlayer>
          <strong>Selecione um podcast para ouvir</strong>
        </EmptyPlayer>
      )}

      <Footer className={!episode ? "empty" : null}>
        <Progress>
          <span>{convertDurationToTimeString(progress ?? 0)}</span>
          <SliderWrapper>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleAudioTimeChange}
                trackStyle={{ backgroundColor: theme.green500 }}
                railStyle={{ backgroundClip: theme.purple300 }}
                handleStyle={{ borderColor: theme.green500, borderWidth: 4 }}
              />
            ) : (
              <EmptySlider />
            )}
          </SliderWrapper>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </Progress>

        {episode && (
          <audio
            ref={audioRef}
            src={episode.url}
            loop={isLooping}
            autoPlay
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <Buttons>
          <ShuffleButton
            isShuffling={isShuffling}
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </ShuffleButton>

          <PlayPreviousButton
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </PlayPreviousButton>

          <PlayButton disabled={!episode} onClick={togglePlay}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" />
            ) : (
              <img src="/play.svg" alt="Tocar" />
            )}
          </PlayButton>

          <PlayNextButton disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar anterior" />
          </PlayNextButton>

          <LoopButton
            isLooping={isLooping}
            disabled={!episode}
            onClick={toggleLoop}>
            <img src="/repeat.svg" alt="Repetir" />
          </LoopButton>
        </Buttons>
      </Footer>
    </PlayerContainer>
  )
}

const PlayerContainer = styled.section`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    width: 26.5rem;
    height: 100vh;
    padding: 3rem 4rem;

    background: ${theme.purple500};

    color: ${theme.white};

    strong {
      font-family: ${theme.fonts.lexend}, sans-serif;
      font-weight: 600;
    }
  `}
`

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
`

const CurrentEpisode = styled.div`
  ${({ theme }) => css`
    text-align: center;

    img {
      border-radius: 1.5rem;
    }

    strong {
      display: block;

      margin-top: 2rem;

      font: 600 1.25rem ${theme.fonts.lexend}, sans-serif;
      line-height: 1.75rem;
    }

    span {
      display: block;

      opacity: 0.6;

      margin-top: 1rem;

      line-height: 1.5rem;
    }
  `}
`

const EmptyPlayer = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;
    height: 20rem;
    padding: 4rem;

    border: 1px dashed ${theme.purple300};
    border-radius: 1.5rem;
    background: linear-gradient(
      143.8deg,
      ${rgba(theme.purple400, 0.8)},
      ${rgba(theme.black, 0)}
    );

    text-align: center;
  `}
`

const Footer = styled.footer`
  align-self: stretch;

  &.empty {
    opacity: 0.5;
  }
`

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  font-size: 0.875rem;

  span {
    display: inline-block;
    width: 4rem;
    text-align: center;
  }
`

const SliderWrapper = styled.div`
  flex: 1;
`

const EmptySlider = styled.div`
  ${({ theme }) => css`
    width: 100%;
    height: 4px;

    border-radius: 2px;
    background: ${theme.purple300};
  `}
`

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;

  margin-top: 2.5rem;
`

const buttonStyles = css`
  border: 0;
  background: transparent;

  font-size: 0;

  transition: filter 0.2s;

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    filter: brightness(0.7);
  }
`

const activeButtonStyles = css`
  filter: invert(0.35) sepia(1) saturate(3) hue-rotate(100deg);

  &:hover {
    filter: brightness(0.6) invert(0.35) sepia(1) saturate(3) hue-rotate(100deg);
  }
`

type ShuffleButtonProps = {
  isShuffling?: boolean
}
const ShuffleButton = styled.button<ShuffleButtonProps>`
  ${buttonStyles}
  ${({ isShuffling }) => css`
    ${isShuffling && activeButtonStyles}
  `}
`
const PlayPreviousButton = styled.button`
  ${buttonStyles}
`
const PlayButton = styled.button`
  ${buttonStyles}
  ${({ theme }) => css`
    width: 4rem;
    height: 4rem;

    border-radius: 1rem;
    background: ${theme.purple400};

    &:hover:not(:disabled) {
      filter: brightness(0.95);
    }
  `}
`
const PlayNextButton = styled.button`
  ${buttonStyles}
`

type LoopButtonProps = {
  isLooping?: boolean
}
const LoopButton = styled.button<LoopButtonProps>`
  ${buttonStyles}
  ${({ isLooping }) => css`
    ${isLooping && activeButtonStyles}
  `}
`
