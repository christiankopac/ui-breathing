import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Pause, Play, RefreshCw } from "lucide-react";
import propTypes from "prop-types";
import GenerativeBackground from './GenerativeBackground';

/* eslint-disable react/no-array-index-key */

const breathingPatterns = {
	"Box Breathing": {
		inhale: 4,
		holdAfterInhale: 4,
		exhale: 4,
		holdAfterExhale: 4,
		description:
			"Equal parts inhale, hold, exhale, and hold. Great for stress relief.",
	},
	"4-7-8 Breathing": {
		inhale: 4,
		holdAfterInhale: 7,
		exhale: 8,
		holdAfterExhale: 0,
		description:
			"Inhale for 4, hold for 7, exhale for 8. Helps with sleep and anxiety.",
	},
	"Deep Calm": {
		inhale: 5,
		holdAfterInhale: 2,
		exhale: 7,
		holdAfterExhale: 0,
		description:
			"Long exhales promote relaxation and parasympathetic response.",
	},
	"Alternate Nostril": {
		inhale: 4,
		holdAfterInhale: 4,
		exhale: 6,
		holdAfterExhale: 2,
		description: "Traditional yogic breathing for balance and focus.",
	},
	"Ocean Breath": {
		inhale: 4,
		holdAfterInhale: 0,
		exhale: 6,
		holdAfterExhale: 0,
		description:
			"Ujjayi breath with slight throat constriction, creating an ocean sound.",
	},
	"Energizing Breath": {
		inhale: 2,
		holdAfterInhale: 0,
		exhale: 2,
		holdAfterExhale: 0,
		description: "Quick, rhythmic breathing to increase energy and alertness.",
	},
	"Lion's Breath": {
		inhale: 4,
		holdAfterInhale: 2,
		exhale: 4,
		holdAfterExhale: 2,
		description:
			"Deep inhale through nose, explosive exhale with tongue out. Releases tension.",
	},
};

const BackgroundAnimation = ({ phase, pattern }) => {
	const [scale, setScale] = useState(1);
	const [rotation, setRotation] = useState(0);

	useEffect(() => {
		// Get the duration for the current phase
		let duration;
		switch (phase) {
			case "inhale":
				duration = pattern.inhale;
				setScale(1);
				break;
			case "holdAfterInhale":
				duration = pattern.holdAfterInhale;
				setScale(1.3);
				break;
			case "exhale":
				duration = pattern.exhale;
				setScale(1.3);
				break;
			case "holdAfterExhale":
				duration = pattern.holdAfterExhale;
				setScale(1);
				break;
			default:
				duration = 0;
		}

		// Configure the animation based on the phase
		const element = document.querySelector(".mandala-container");
		if (element) {
			element.style.transition = `transform ${duration}s linear`;

			if (phase === "inhale") {
				element.style.transform = "scale(1.3)";
			} else if (phase === "exhale") {
				element.style.transform = "scale(1)";
			}
		}

		// Handle rotation animation
		let rotationInterval;
		if (phase === "inhale" || phase === "exhale") {
			const startRotation = rotation;
			const endRotation = startRotation + (phase === "inhale" ? 360 : -360);
			const fps = 60;
			const totalFrames = duration * fps;
			let frame = 0;

			rotationInterval = setInterval(() => {
				if (frame < totalFrames) {
					const progress = frame / totalFrames;
					setRotation(startRotation + (endRotation - startRotation) * progress);
					frame++;
				} else {
					clearInterval(rotationInterval);
				}
			}, 1000 / fps);
		}

		return () => {
			if (rotationInterval) {
				clearInterval(rotationInterval);
			}
			// Reset animation state when cleaning up
			if (element) {
				element.style.transition = 'none';
				element.style.transform = 'scale(1)';
			}
			setScale(1);
			setRotation(0);
		};
	}, [phase, pattern, rotation]);

	return (
		<div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-r from-blue-900 to-purple-900">
			{/* Central mandala */}
			<div className="mandala-container absolute inset-0 flex items-center justify-center">
				{[...Array(6)].map((_, i) => (
					<div
						key={`mandala-ring-${i}`}
						className="absolute w-96 h-96 border-2 border-white/20 rounded-full"
						style={{
							transform: `rotate(${rotation + i * 60}deg) scale(${1 + i * 0.2})`,
							opacity: 0.1 + i * 0.1,
						}}
					/>
				))}

				{/* Breathing indicator circles */}
				{/* eslint-disable-next-line react/no-array-index-key */}
				{[...Array(12)].map((_, i) => (
					<div
						key={`breathing-indicator-${i}`}
						className="absolute w-4 h-4 rounded-full bg-white/40"
						style={{
							transform: `rotate(${i * 30 + rotation}deg) translateY(-150px)`,
							opacity: phase.includes("hold") ? 0.8 : 0.4,
						}}
					/>
				))}
			</div>

			{/* Radial gradient overlay */}
			<div
				className="absolute inset-0"
				style={{
					background: `radial-gradient(circle at center, 
            transparent ${scale * 30}%, 
            rgba(0, 0, 0, 0.3) ${scale * 60}%, 
            rgba(0, 0, 0, 0.5) 100%)`,
					transition: "background 0.1s linear",
				}}
			/>
		</div>
	);
};
BackgroundAnimation.propTypes = {
	phase: propTypes.string.isRequired,
	pattern: propTypes.object.isRequired,
};

const CountdownDisplay = ({ count, onComplete }) => {
	const [currentCount, setCurrentCount] = useState(count);

	useEffect(() => {
		if (currentCount > 0) {
			const timer = setTimeout(() => {
				setCurrentCount((prev) => prev - 1);
			}, 1000);

			return () => clearTimeout(timer);
		}
		onComplete();
	}, [currentCount, onComplete]);

	return (
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="text-center space-y-8 text-white">
				<div
					className="text-6xl font-bold animate-fade-in relative"
					style={{
						background: "linear-gradient(135deg, #60A5FA, #7C3AED)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						textShadow: "0 2px 10px rgba(124, 58, 237, 0.3)",
						animation: "pulse 2s infinite",
					}}
				>
					<div className="absolute inset-0 blur-lg bg-blue-500/30 animate-pulse rounded-full" />
					<div className="relative">
						{currentCount === 0 ? "Start!" : currentCount}
					</div>
				</div>
				<div className="text-2xl font-light animate-fade-in">Get Ready...</div>
			</div>
		</div>
	);
};
CountdownDisplay.propTypes = {
	count: propTypes.number.isRequired,
	onComplete: propTypes.func.isRequired,
};

const FocusedBreathingDisplay = ({
	phase,
	timeLeft,
	currentRepetition,
	repetitions,
	onPause,
	onReset,
}) => {
	return (
		<div className="fixed inset-0 flex items-center justify-center">
			<div className="text-center space-y-8 text-white">
				<div className="text-6xl font-bold animate-fade-in">{timeLeft}</div>
				<div className="text-4xl font-light animate-fade-in">
					{phase === "inhale"
						? "Breathe In"
						: phase === "holdAfterInhale"
							? "Hold"
							: phase === "exhale"
								? "Breathe Out"
								: "Hold"}
				</div>
				<div className="text-xl font-light opacity-60">
					Cycle {currentRepetition} of {repetitions}
				</div>
				<div className="flex gap-4 justify-center mt-8">
					<Button
						variant="outline"
						size="lg"
						className="bg-white/10 hover:bg-white/20 border-white/20"
						onClick={onPause}
					>
						<Pause className="w-6 h-6" />
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="bg-white/10 hover:bg-white/20 border-white/20"
						onClick={onReset}
					>
						<RefreshCw className="w-6 h-6" />
					</Button>
				</div>
			</div>
		</div>
	);
};
FocusedBreathingDisplay.propTypes = {
	phase: propTypes.string.isRequired,
	timeLeft: propTypes.number.isRequired,
	currentRepetition: propTypes.number.isRequired,
	repetitions: propTypes.number.isRequired,
	onPause: propTypes.func.isRequired,
	onReset: propTypes.func.isRequired,
};

const Footer = () => {
	return (
		<footer className="fixed bottom-2 right-2 text-white/60 text-sm hover:text-white/90 transition-colors">
			<a
				href="https://kopac.dev"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:underline"
			>
				made with 🧘‍♂️ by @christiankopac
			</a>
		</footer>
	);
};

const BreathingExercises = () => {
	const [selectedPattern, setSelectedPattern] = useState("Box Breathing");
	const [isActive, setIsActive] = useState(false);
	const [phase, setPhase] = useState("inhale");
	const [timeLeft, setTimeLeft] = useState(0);
	const [repetitions, setRepetitions] = useState(5);
	const [currentRepetition, setCurrentRepetition] = useState(1);
	const [showSettings, setShowSettings] = useState(true);
	const [isCountingDown, setIsCountingDown] = useState(false);

	const startExercise = () => {
		setIsCountingDown(true);
		setShowSettings(false);
	};

	useEffect(() => {
		let timer;
		if (isActive) {
			const pattern = breathingPatterns[selectedPattern];

			timer = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 0) {
						switch (phase) {
							case "inhale":
								setPhase("holdAfterInhale");
								return pattern.holdAfterInhale;
							case "holdAfterInhale":
								setPhase("exhale");
								return pattern.exhale;
							case "exhale":
								if (pattern.holdAfterExhale > 0) {
									setPhase("holdAfterExhale");
									return pattern.holdAfterExhale;
								}
								if (currentRepetition >= repetitions) {
									setIsActive(false);
									setCurrentRepetition(1);
									return 0;
								}
								setCurrentRepetition((prev) => prev + 1);
								setPhase("inhale");
								return pattern.inhale;
							case "holdAfterExhale":
								if (currentRepetition >= repetitions) {
									setIsActive(false);
									setCurrentRepetition(1);
									return 0;
								}
								setCurrentRepetition((prev) => prev + 1);
								setPhase("inhale");
								return pattern.inhale;
							default:
								return 0;
						}
					}
					return prev - 1;
				});
			}, 1000);
		}
		return () => {
			clearInterval(timer);
		};
	}, [isActive, phase, selectedPattern, repetitions, currentRepetition]);

	const handleCountdownComplete = () => {
		setIsCountingDown(false);
		setIsActive(true);
		setPhase("inhale");
		setTimeLeft(breathingPatterns[selectedPattern].inhale);
		setCurrentRepetition(1);
	};

	const handlePatternSelect = (pattern) => {
		setSelectedPattern(pattern);
		setIsActive(false);
		setPhase("inhale");
		setTimeLeft(breathingPatterns[pattern].inhale);
		setCurrentRepetition(1);
		setShowSettings(true);
	};

	if (isCountingDown) {
		return (
			<>
				<GenerativeBackground phase={phase} />
				<BackgroundAnimation
					phase="holdAfterExhale"
					pattern={breathingPatterns[selectedPattern]}
				/>
				<CountdownDisplay count={3} onComplete={handleCountdownComplete} />
			</>
		);
	}

	if (isActive && !showSettings) {
		return (
			<>
				<GenerativeBackground phase={phase} />
				<BackgroundAnimation
					phase={phase}
					pattern={breathingPatterns[selectedPattern]}
				/>
				<FocusedBreathingDisplay
					phase={phase}
					timeLeft={timeLeft}
					currentRepetition={currentRepetition}
					repetitions={repetitions}
					onPause={() => {
						setShowSettings(true);
						setIsActive(false);
					}}
					onReset={() => {
						setIsActive(false);
						setPhase("inhale");
						setTimeLeft(breathingPatterns[selectedPattern].inhale);
						setCurrentRepetition(1);
						setShowSettings(true);
					}}
				/>
			</>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<GenerativeBackground phase={phase} />
			<BackgroundAnimation
				phase="holdAfterExhale"
				pattern={breathingPatterns[selectedPattern]}
			/>

			<Card className="w-full max-w-md bg-white/90 backdrop-blur-sm">
				<CardHeader>
					<CardTitle>Breathing Exercises</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-2 gap-2">
						{Object.keys(breathingPatterns).map((pattern) => (
							<Button
								key={pattern}
								variant={selectedPattern === pattern ? "default" : "outline"}
								onClick={() => handlePatternSelect(pattern)}
								className={`
									text-sm font-medium transition-all duration-300
									${selectedPattern === pattern
										? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-purple-500/20 scale-[1.02] border-transparent"
										: "border-gray-200 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50/50"
									}
								`}
							>
								{pattern}
							</Button>
						))}
					</div>

					<div className="text-center space-y-4">
						<p className="text-gray-600">
							{breathingPatterns[selectedPattern].description}
						</p>

						<div className="flex items-center justify-center gap-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setRepetitions(Math.max(1, repetitions - 1))}
								disabled={isActive}
							>
								-
							</Button>
							<div className="text-sm">{repetitions} cycles</div>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setRepetitions(repetitions + 1)}
								disabled={isActive}
							>
								+
							</Button>
						</div>

						<Button
							onClick={startExercise}
							size="lg"
							className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/40"
						>
							<Play className="mr-2 w-5 h-5 animate-pulse" />
							Start
						</Button>
					</div>
				</CardContent>
			</Card>
			<Footer />
		</div>
	);
};

export default BreathingExercises;
