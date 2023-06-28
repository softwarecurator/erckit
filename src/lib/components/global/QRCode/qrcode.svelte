<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import QRCodeUtil, { type QRCodeErrorCorrectionLevel } from 'qrcode';

	export let ecl: QRCodeErrorCorrectionLevel = 'M';
	export let size: number = 200;
	export let uri: string;
	export let image: string;

	$: dots = [] as any[];

	onMount(() => {
		const generateMatrix = (value: string, errorCorrectionLevel: QRCodeErrorCorrectionLevel) => {
			const arr = Array.prototype.slice.call(
				QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
				0
			);
			const sqrt = Math.sqrt(arr.length);
			return arr.reduce(
				(rows: any[], key: any, index: number) =>
					(index % sqrt === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
				[]
			);
		};

		const matrix = generateMatrix(uri, ecl);
		const cellSize = size / matrix.length;
		let qrList = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: 1 }
		];

		qrList.forEach(({ x, y }) => {
			const x1 = (matrix.length - 7) * cellSize * x;
			const y1 = (matrix.length - 7) * cellSize * y;
			for (let i = 0; i < 3; i++) {
				dots = [
					...dots,
					{
						type: 'rect',
						key: `${i}-${x}-${y}`,
						fill: i % 2 !== 0 ? 'black' : 'white',
						rx: (i - 2) * -5 + (i === 0 ? 2 : 3),
						ry: (i - 2) * -5 + (i === 0 ? 2 : 3),
						width: cellSize * (7 - i * 2),
						height: cellSize * (7 - i * 2),
						x: x1 + cellSize * i,
						y: y1 + cellSize * i
					}
				];
			}
		});

		const clearArenaSize = Math.floor((76 + 25) / cellSize);
		const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
		const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

		matrix.forEach((row: any[], i: number) => {
			row.forEach((_: any, j: number) => {
				if (matrix[i][j]) {
					if (
						!(
							(i < 7 && j < 7) ||
							(i > matrix.length - 8 && j < 7) ||
							(i < 7 && j > matrix.length - 8)
						)
					) {
						if (
							image ||
							!(
								i > matrixMiddleStart &&
								i < matrixMiddleEnd &&
								j > matrixMiddleStart &&
								j < matrixMiddleEnd
							)
						) {
							dots = [
								...dots,
								{
									type: 'circle',
									key: `circle-${i}-${j}`,
									cx: i * cellSize + cellSize / 2,
									cy: j * cellSize + cellSize / 2,
									fill: 'white',
									r: cellSize / 3
								}
							];
						}
					}
				}
			});
		});
	});

	onDestroy(() => {
		dots = [];
	});
</script>

<div>
	<svg
		height={size}
		width={size}
		viewBox={`0 0 ${size} ${size}`}
		style={`width: ${size}px; height: ${size}px;`}
	>
		<rect fill="transparent" height={size} width={size} />
		{#each dots as dot (dot.key)}
			{#if dot.type === 'rect'}
				<rect
					fill={dot.fill}
					rx={dot.rx}
					ry={dot.ry}
					width={dot.width}
					height={dot.height}
					x={dot.x}
					y={dot.y}
				/>
			{:else if dot.type === 'foreignObject'}
				<rect
					fill={dot.fill}
					rx={dot.rx}
					ry={dot.ry}
					width={dot.width}
					height={dot.height}
					x={dot.x}
					y={dot.y}
				/>
				<foreignObject width={dot.width} height={dot.height} x={dot.x} y={dot.y}>
					{@html dot.content}
				</foreignObject>
			{:else if dot.type === 'circle'}
				<circle cx={dot.cx} cy={dot.cy} fill={dot.fill} r={dot.r} />
			{/if}
		{/each}
	</svg>
</div>
